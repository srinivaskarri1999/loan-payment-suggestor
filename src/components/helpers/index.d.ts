import { LoanFormInitialValues } from '../loans/loan-form/util'

export type Loan = Omit<LoanFormInitialValues, 'notValid'>

export type RepayScheme = {
  [loanId: string]: {
    repayAmount: number
    accountClosed?: boolean
    amountUsed?: number
    saved?: number
  }
}
