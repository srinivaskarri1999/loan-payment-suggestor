import { monthsDifference, monthsIncrease, roundTwoDecimals } from './util'
import {
  adjustLoans,
  applyPrepaymentCharges,
  applyRepayScheme,
  getLoansEndDate,
  getLoanStats,
  reversePrepaymentCharges,
} from './loans'

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
    if (!repayScheme || !repayScheme[loan.id]) {
      return
    }
    const repayAmount = applyPrepaymentCharges(loan, repayScheme, date)
    const interest = (loan.amount * loan.interestRate) / 1200
    const totalBeforeRepay = getLoanStats(
      loan.amount,
      loan.interestRate,
      loan.emi
    ).paid

    const amount = loan.amount + interest - loan.emi - repayAmount
    let totalAfterRepay = getLoanStats(amount, loan.interestRate, loan.emi).paid
    const paid = Math.min(
      loan.amount + interest,
      loan.emi + (repayScheme[loan.id]?.repayAmount ?? 0)
    )

    totalAfterRepay += paid
    savedAmount += totalBeforeRepay - totalAfterRepay

    // update repayScheme as we don't have to pay the entire amount
    if (loan.amount + interest <= repayAmount + loan.emi) {
      const remainingAmount = loan.amount + interest - loan.emi
      if (remainingAmount > 0) {
        repayScheme[loan.id].amountUsed = reversePrepaymentCharges(
          loan,
          {
            [loan.id]: {
              repayAmount: remainingAmount,
            },
          },
          date
        )
      }
    }
  })

  return savedAmount
}

export const getDateSuggestion = (loans, repayAmount, date) => {
  let maxSaving = 0
  let maxRepayScheme = {}

  loans.forEach((loan) => {
    const repayScheme = {
      [loan.id]: {
        repayAmount: Math.min(repayAmount, Math.max(loan.amount - loan.emi, 0)),
        saved: 0,
      },
    }
    const saving = getSavedAmount(loans, repayScheme, date)
    repayScheme[loan.id].saved = roundTwoDecimals(saving)
    if (saving > maxSaving) {
      maxSaving = saving
      maxRepayScheme = repayScheme
    }
  })

  return maxRepayScheme
}

export const getEntireSuggestions = (loans, repayAmount, repayStartDate) => {
  // let adjustedLoans = adjustLoans(loans, repayStartDate)
  // let endDate = getLoansEndDate(adjustedLoans)

  // const suggestions = []
  // const months = monthsDifference(repayStartDate, endDate)
  // for (let i = 0; i < months; i++) {
  //   const date = monthsIncrease(repayStartDate, i)
  //   const repayScheme = getDateSuggestion(adjustedLoans, repayAmount, date)
  //   suggestions.push({
  //     date,
  //     repayScheme,
  //   })
  //   adjustedLoans = applyRepayScheme(adjustedLoans, repayScheme)
  // }

  const suggestions = getSuggestions(loans, repayAmount, repayStartDate)

  return suggestions
}

const getSuggestions = (loans, repayAmount, repayStartDate) => {
  let adjustedLoans = adjustLoans(loans, repayStartDate)
  let endDate = getLoansEndDate(adjustedLoans)
  const months = monthsDifference(repayStartDate, endDate)

  const dp = {}
  dp[-1] = {}
  adjustedLoans.forEach((loan, i) => {
    dp[i] = {}
    for (let j = 0; j < months; j++) {
      const loans = j ? dp[i][j - 1].loans : adjustedLoans
      const repayScheme = {
        [loan.id]: { repayAmount },
      }
      // console.log(i, j)
      // console.log(loans, repayScheme)
      const savedAmount = getSavedAmount(loans, repayScheme)
      const prevMonthMax = j ? dp[i][j - 1].saved : 0
      const prevLoanMax = i ? dp[i - 1][j].loanMax : 0
      const prevLoanRepaySchemeMax = i ? dp[i - 1][j].loanRepaySchemeMax : {}
      repayScheme[loan.id].saved = savedAmount

      // console.log({ savedAmount, prevMonthMax, prevLoanMax })

      dp[i][j] = {
        saved: prevMonthMax + Math.max(savedAmount, prevLoanMax),
        loans: applyRepayScheme(
          loans,
          savedAmount > prevLoanMax ? repayScheme : prevLoanRepaySchemeMax
        ),
        loanMax: Math.max(prevLoanMax, savedAmount),
        repayScheme,
        loanRepaySchemeMax:
          savedAmount > prevLoanMax ? repayScheme : prevLoanRepaySchemeMax,
        savedThisMonth: Math.max(savedAmount, prevLoanMax),
      }

      // console.log(dp[i][j])
      // console.log('-----------------------------')
    }
  })

  console.log(dp)
  const suggestions = []
  for (let j = 0; j < months; j++) {
    const date = monthsIncrease(repayStartDate, j)
    suggestions.push({
      date,
      repayScheme: dp[adjustedLoans.length - 1][j].loanRepaySchemeMax,
    })
  }

  console.log({ suggestions })
  return suggestions
}
