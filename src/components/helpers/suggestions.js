import { monthsDifference, monthsIncrease } from './util'
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
  let finalRepayScheme = {}
  let amountRemaining = repayAmount
  let prevAmountRem = 0

  while (amountRemaining > 0.1 && prevAmountRem !== amountRemaining) {
    prevAmountRem = amountRemaining
    let maxSaved = 0
    let maxRepayScheme = {}
    let amountUsed = 0
    // eslint-disable-next-line no-loop-func
    loans.forEach((loan) => {
      if (finalRepayScheme[loan.id]) {
        return
      }

      const repayScheme = {
        [loan.id]: { repayAmount: amountRemaining },
      }

      const savedAmount = getSavedAmount(loans, repayScheme, date)
      repayScheme[loan.id].saved = savedAmount

      if (savedAmount > maxSaved) {
        maxSaved = savedAmount
        maxRepayScheme = repayScheme
        amountUsed =
          maxRepayScheme[loan.id].amountUsed ??
          maxRepayScheme[loan.id].repayAmount
      }
    })
    amountRemaining -= amountUsed
    finalRepayScheme = {
      ...finalRepayScheme,
      ...maxRepayScheme,
    }
  }

  return finalRepayScheme
}

export const getEntireSuggestions = (loans, repayAmount, repayStartDate) => {
  let adjustedLoans = adjustLoans(loans, repayStartDate)
  let endDate = getLoansEndDate(adjustedLoans)

  const suggestions = []
  const months = monthsDifference(repayStartDate, endDate)
  for (let i = 0; i < months; i++) {
    if (adjustedLoans.length === 0) {
      break
    }
    const date = monthsIncrease(repayStartDate, i)
    const repayScheme = getDateSuggestion(adjustedLoans, repayAmount, date)
    const appliedScheme = applyRepayScheme(adjustedLoans, repayScheme)
    suggestions.push({
      date,
      repayScheme,
    })
    adjustedLoans = appliedScheme.loans
    repayAmount += appliedScheme.closedAccountsEmi
  }

  return suggestions
}
