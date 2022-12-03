import { roundTwoDecimals } from './util'

export const formatAmount = (amount) => {
  const formatter = Intl.NumberFormat('en-IN')
  return formatter.format(amount)
}

export const formatInterestRate = (interestRate) => {
  return interestRate + '%'
}

export const formatLoan = (loan) => {
  const formattedLoan = { ...loan }
  if (loan.amount) {
    formattedLoan.amount = formatAmount(roundTwoDecimals(loan.amount))
  }

  if (loan.emi) {
    formattedLoan.emi = formatAmount(roundTwoDecimals(loan.emi))
  }

  if (loan.interestRate) {
    formattedLoan.interestRate = formatInterestRate(loan.interestRate)
  }

  if (loan.prePaymentCharges) {
    formattedLoan.prePaymentCharges = formatInterestRate(loan.prePaymentCharges)
  }

  return formattedLoan
}
