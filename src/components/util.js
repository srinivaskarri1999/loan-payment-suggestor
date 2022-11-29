export const roundTwoDecimals = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export const calculateEmi = (principle, interest, loanTenure) => {
  const p = principle
  const r = parseFloat(interest) / 1200
  const n = loanTenure
  const m = (1 + r) ** n
  const emi = (p * r * m) / (m - 1)

  return roundTwoDecimals(emi)
}

const getLoanTenure = (amount, emi) => {
  return Math.ceil(amount / emi)
}

const totalPaid = (principle, interestRate, loanTenure) => {
  return calculateEmi(principle, interestRate, loanTenure) * loanTenure
}

const monthsDifference = (startDate, endDate) => {
  startDate = new Date(startDate)
  endDate = new Date(endDate)
  return (
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    endDate.getMonth() -
    startDate.getMonth()
  )
}

const monthsIncrease = (date, months) => {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() + months)
  return newDate
}

const getPrincipleDue = (loan, currentDate) => {
  const months = monthsDifference(loan.startDate, currentDate)

  let principle = loan.amount
  for (let i = 0; i < months; i++) {
    principle += principle * (loan.interestRate / 1200)
    principle -= loan.emi
  }

  return principle
}

// This function would filter all loans which end dates are after `date` and adjusts the loan amount and tenure with respective to `date`
const adjustLoans = (loans, date) => {
  date = new Date(date)
  const adjustedLoans = [
    ...loans.filter((loan) => {
      return monthsIncrease(loan.startDate, loan.loanTenure) >= date
    }),
  ]

  return adjustedLoans.map((loan) => {
    const adjustedLoan = { ...loan }
    adjustedLoan.amount = getPrincipleDue(loan, date)
    adjustedLoan.loanTenure =
      loan.loanTenure - monthsDifference(loan.startDate, date)
    return adjustedLoan
  })
}

const getLoanRepayAmount = (loan, repayScheme, date) => {
  if (!repayScheme[loan.id] || !repayScheme[loan.id].repayAmount) {
    return 0
  }

  const isPrepaymentApplicable =
    monthsIncrease(loan.startDate, loan.loanTenure) >= new Date(date)
  let repayAmount = repayScheme[loan.id].repayAmount
  if (isPrepaymentApplicable) {
    repayAmount *= 1 - loan.prePaymentCharges / 100
  }

  return repayAmount
}

/* 
  This function returns the adjusted loans after applying the repayScheme
*/
const applyRepayScheme = (loans, repayScheme, date) => {
  return loans
    .map((loan) => {
      if (!repayScheme[loan.id] || !repayScheme[loan.id].repayAmount) {
        return loan
      }
      const repayAmount = getLoanRepayAmount(loan, repayScheme, date)
      const amount = Math.max(0, loan.amount - loan.emi - repayAmount)
      const loanTenure = getLoanTenure(amount, loan.emi)
      if (!amount) {
        return null
      }

      return {
        ...loan,
        amount,
        loanTenure,
      }
    })
    .filter((loan) => !!loan)
}

/* 
This function will find the the total amount saved when payment is done with `repayScheme` on `date`
repayScheme = {
  [loan.id] : {
    repayAmount: 5000
  }
}
*/
const getSavedAmount = (loans, repayScheme, date) => {
  if (!repayScheme || !loans) {
    return 0
  }

  let savedAmount = 0
  loans.forEach((loan) => {
    const repayAmount = getLoanRepayAmount(loan, repayScheme, date)
    const totalBeforeRepay = totalPaid(
      loan.amount,
      loan.interestRate,
      loan.loanTenure
    )
    const amount = Math.max(0, loan.amount - loan.emi - repayAmount)
    const loanTenure = getLoanTenure(amount, loan.emi)
    const totalAfterRepay =
      loan.emi + repayAmount + totalPaid(amount, loan.interestRate, loanTenure)

    savedAmount += totalBeforeRepay - totalAfterRepay
  })

  return savedAmount
}

export const getDateSuggestion = (loans, repayAmount, date) => {
  let maxSaving = 0
  let maxRepayScheme = {}
  console.log(loans)

  loans.forEach((loan) => {
    const repayScheme = {
      [loan.id]: {
        repayAmount: Math.min(repayAmount, Math.max(loan.amount - loan.emi, 0)),
        saved: 0,
      },
    }
    const saving = getSavedAmount(loans, repayScheme, date)
    console.log(loan.name, saving)
    repayScheme[loan.id].saved = roundTwoDecimals(saving)
    if (saving > maxSaving) {
      maxSaving = saving
      maxRepayScheme = repayScheme
    }
  })

  console.log({ loans, maxRepayScheme })

  return maxRepayScheme
}

export const getEntireSuggestions = (loans, repayAmount, repayStartDate) => {
  let adjustedLoans = adjustLoans(loans, repayStartDate)
  console.log({ adjustedLoans })
  let endDate = new Date(repayStartDate)
  adjustedLoans.forEach((loan) => {
    const date = monthsIncrease(loan.startDate, loan.loanTenure)
    if (date >= endDate) {
      endDate = date
    }
  })

  const suggestions = []
  const months = monthsDifference(repayStartDate, endDate)
  for (let i = 0; i < months; i++) {
    const date = monthsIncrease(repayStartDate, i)
    const repayScheme = getDateSuggestion(adjustedLoans, repayAmount, date)
    suggestions.push({
      date,
      repayScheme,
    })
    adjustedLoans = applyRepayScheme(adjustedLoans, repayScheme)
  }

  console.log(suggestions)
  return suggestions
}
