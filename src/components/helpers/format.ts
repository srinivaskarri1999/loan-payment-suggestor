import { roundTwoDecimals } from './util'

export const formatAmount = (amount: number | null): string => {
  if (amount === null) {
    return '-'
  }
  const formatter = Intl.NumberFormat('en-IN')
  return formatter.format(roundTwoDecimals(amount))
}

export const formatInterestRate = (interestRate: number | null): string => {
  if (interestRate === null) {
    return '-'
  }

  return interestRate + '%'
}
