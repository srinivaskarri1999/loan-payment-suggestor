import { getEntireSuggestions } from '../helpers/suggestions'

export const suggestionInitialValues = {
  repayAmount: undefined,
  repayStartDate: undefined,
  notValid: {
    repayAmount: false,
    repayStartDate: false,
  },
}

export const parseValues = (form) => {
  const parsedForm = { ...form }
  parsedForm.repayAmount = parseFloat(form.repayAmount)

  delete parsedForm['notValid']
  return parsedForm
}

export const getRepayScheduleHeaders = (loans) => {
  return ['Month', ...loans.map((loan) => loan.name), 'Saved']
}

export const getRepaySchedule = (loans, repay) => {
  const suggestions = getEntireSuggestions(
    loans,
    repay.repayAmount,
    repay.repayStartDate
  )
  const data = []
  suggestions.forEach((suggestion) => {
    const month = suggestion.date.toLocaleString('en-US', {
      month: 'long',
    })
    const year = suggestion.date.getFullYear()
    const row = [`${month} ${year}`]
    let saved = 0
    loans.forEach((loan) => {
      if (suggestion.repayScheme[loan.id]) {
        row.push(suggestion.repayScheme[loan.id].repayAmount || '-')
        saved += suggestion.repayScheme[loan.id].saved || 0
      } else {
        row.push('-')
      }
    })
    row.push(saved)
    data.push(row)
  })
  return data
}
