import dayjs from 'dayjs'
import { Loan } from 'src/components/helpers'

export type LoanFormInitialValues = {
  id?: string
  name: string
  amount: number | null
  startDate: dayjs.Dayjs
  loanTenure: number | null
  interestRate: number | null
  emi: number | null
  prePaymentCharges: number | null
  prePaymentChargesDuration: number | null
  notValid: {
    name: boolean
    amount: boolean
    startDate: boolean
    loanTenure: boolean
    interestRate: boolean
    emi: boolean
    prePaymentCharges: boolean
    prePaymentChargesDuration: boolean
  }
}

export const loanFormInitialValues: LoanFormInitialValues = {
  name: '',
  amount: null,
  startDate: dayjs(Date()),
  loanTenure: null,
  interestRate: null,
  emi: null,
  prePaymentCharges: null,
  prePaymentChargesDuration: null,
  notValid: {
    name: false,
    amount: false,
    loanTenure: false,
    interestRate: false,
    startDate: false,
    prePaymentCharges: false,
    prePaymentChargesDuration: false,
    emi: false,
  },
}

export const isValid = (
  form: LoanFormInitialValues,
  setForm: (form: LoanFormInitialValues) => void
) => {
  let valid = true
  const notValid = { ...loanFormInitialValues.notValid }
  if (!form.name) {
    valid = false
    notValid.name = true
  }
  if (!form.amount || isNaN(form.amount)) {
    valid = false
    notValid.amount = true
  }
  if (!form.startDate) {
    valid = false
    notValid.startDate = true
  }
  if (
    !form.loanTenure ||
    isNaN(form.loanTenure) ||
    !Number.isInteger(form.loanTenure)
  ) {
    valid = false
    notValid.loanTenure = true
  }
  if (!form.interestRate || isNaN(form.interestRate)) {
    valid = false
    notValid.interestRate = true
  }
  if (!form.emi || isNaN(form.emi)) {
    valid = false
    notValid.emi = true
  }
  if (form.prePaymentCharges && isNaN(form.prePaymentCharges)) {
    valid = false
    notValid.prePaymentCharges = true
  }
  if (
    form.prePaymentChargesDuration &&
    (isNaN(form.prePaymentChargesDuration) ||
      !Number.isInteger(form.prePaymentChargesDuration))
  ) {
    valid = false
    notValid.prePaymentChargesDuration = true
  }

  setForm({ ...form, notValid })
  return valid
}

export const formatValue = (
  name: keyof Omit<LoanFormInitialValues, 'notValid'>,
  value: string
) => {
  if (!value || name === 'id' || name === 'name' || name === 'startDate') {
    return value.trim()
  }

  if (name === 'loanTenure' || name === 'prePaymentChargesDuration') {
    return parseInt(value.trim())
  }

  return parseFloat(value.trim())
}

export const formatLocalStorage = (arr: Record<keyof Loan, string>[]) => {
  return arr.map((data) => ({
    ...data,
    amount: parseFloat(data.amount),
    startDate: dayjs(data.startDate),
    loanTenure: parseInt(data.loanTenure),
    interestRate: parseFloat(data.interestRate),
    emi: parseFloat(data.emi),
    prePaymentCharges: parseFloat(data.prePaymentCharges),
    prePaymentChargesDuration: parseInt(data.prePaymentChargesDuration),
  }))
}
