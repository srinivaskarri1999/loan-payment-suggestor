import { monthsDifference, monthsIncrease, roundTwoDecimals } from './util'

export const calculateEmi = (principle, interest, loanTenure) => {
  const p = principle
  const r = parseFloat(interest) / 1200
  const n = loanTenure
  const m = (1 + r) ** n
  const emi = (p * r * m) / (m - 1)

  return roundTwoDecimals(emi)
}

export const getLoansEndDate = (loans) => {
  let endDate = new Date()
  loans.forEach((loan) => {
    const date = monthsIncrease(loan.startDate, loan.loanTenure)
    if (date >= endDate) {
      endDate = date
    }
  })

  return endDate
}

export const getLoanTenure = (amount, interestRate, emi) => {
  let loanTenure = 0
  while (amount > 0) {
    amount += (amount * interestRate) / 1200
    amount -= emi
    loanTenure++
  }
  return loanTenure
}

export const totalPaid = (principle, interestRate, loanTenure) => {
  if (!principle || !loanTenure) {
    return 0
  }
  return calculateEmi(principle, interestRate, loanTenure) * loanTenure
}

export const getPrincipleDue = (loan, currentDate) => {
  const months = monthsDifference(loan.startDate, currentDate)

  let principle = loan.amount
  for (let i = 0; i < months; i++) {
    principle += principle * (loan.interestRate / 1200)
    principle -= loan.emi
  }

  return principle
}

export const applyPrepaymentCharges = (loan, repayScheme, date) => {
  if (!repayScheme[loan.id] || repayScheme[loan.id].repayAmount <= 0) {
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

export const reversePrepaymentCharges = (loan, repayScheme, date) => {
  if (!repayScheme[loan.id] || repayScheme[loan.id].repayAmount <= 0) {
    return 0
  }

  const isPrepaymentApplicable =
    monthsIncrease(loan.startDate, loan.loanTenure) >= new Date(date)
  let repayAmount = repayScheme[loan.id].repayAmount
  if (isPrepaymentApplicable) {
    repayAmount *= 1 + loan.prePaymentCharges / 100
  }

  return repayAmount
}

// This function would filter all loans which end dates are after `date` and adjusts the loan amount and tenure with respective to `date`
export const adjustLoans = (loans, date) => {
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

/* 
  This function returns the adjusted loans after applying the repayScheme
*/
export const applyRepayScheme = (loans, repayScheme, date) => {
  return loans
    .map((loan) => {
      // console.log('Apply:', loan, repayScheme)
      const repayAmount = applyPrepaymentCharges(loan, repayScheme, date)
      // console.log('Applu RepayAmount:', repayAmount)
      const interest = (loan.amount * loan.interestRate) / 1200
      const amount = Math.max(
        0,
        loan.amount + interest - loan.emi - repayAmount
      )
      const loanTenure = getLoanTenure(amount, loan.interestRate, loan.emi)
      if (!amount || !loanTenure) {
        return null
      }

      // console.log('Return Apply:', {
      //   ...loan,
      //   amount,
      //   loanTenure,
      // })

      return {
        ...loan,
        amount: roundTwoDecimals(amount),
        loanTenure,
      }
    })
    .filter((loan) => !!loan)
}
