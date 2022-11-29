export const isValid = (form, setForm) => {
  let valid = true
  const notValid = { ...loanFormInitialValues.notValid }
  if (!form.name) {
    valid = false
    notValid.name = true
  }
  if (!form.amount && !isNaN(form.amount)) {
    valid = false
    notValid.amount = true
  }
  if (!form.startDate) {
    valid = false
    notValid.startDate = true
  }
  if (
    !form.loanTenure &&
    !isNaN(form.loanTenure) &&
    Number.isInteger(form.loanTenure)
  ) {
    valid = false
    notValid.loanTenure = true
  }
  if (!form.interestRate && !isNaN(form.interestRate)) {
    valid = false
    notValid.interestRate = true
  }
  if (!form.emi && !isNaN(form.emi)) {
    valid = false
    notValid.emi = true
  }
  if (form.prePaymentCharges && isNaN(form.prePaymentCharges)) {
    valid = false
    notValid.prePaymentCharges = true
  }
  if (
    form.prePaymentChargesDuration &&
    isNaN(form.prePaymentChargesDuration) &&
    !Number.isInteger(form.prePaymentChargesDuration)
  ) {
    valid = false
    notValid.prePaymentChargesDuration = true
  }

  setForm({ ...form, notValid })
  return valid
}

export const parseValues = (form) => {
  const parsedForm = { ...form }
  parsedForm.amount = parseFloat(form.amount)
  parsedForm.loanTenure = parseInt(form.loanTenure)
  parsedForm.interestRate = parseFloat(form.interestRate)
  parsedForm.emi = parseFloat(form.emi)
  parsedForm.prePaymentCharges = parseFloat(form.prePaymentCharges || 0)
  parsedForm.prePaymentChargesDuration = parseFloat(
    form.prePaymentChargesDuration || 0
  )

  delete parsedForm['notValid']
  return parsedForm
}

export const loanFormInitialValues = {
  name: '',
  amount: undefined,
  startDate: undefined,
  loanTenure: undefined,
  interestRate: undefined,
  emi: undefined,
  prePaymentCharges: undefined,
  prePaymentChargesDuration: undefined,
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
