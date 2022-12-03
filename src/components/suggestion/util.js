import { Typography } from '@mui/material'
import { formatAmount } from '../helpers/format'
import { getEntireSuggestions } from '../helpers/suggestions'
import { roundTwoDecimals } from '../helpers/util'

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
  let totalSaved = 0
  const data = []
  const totals = {}
  suggestions.forEach((suggestion) => {
    const month = suggestion.date.toLocaleString('en-US', {
      month: 'long',
    })
    const year = suggestion.date.getFullYear()
    const row = [`${month} ${year}`]
    let saved = 0
    loans.forEach((loan, i) => {
      if (!totals[i]) {
        totals[i] = 0
      }

      let closed = ''
      if (suggestion.repayScheme[loan.id]) {
        let amount =
          suggestion.repayScheme[loan.id].amountUsed ??
          suggestion.repayScheme[loan.id].repayAmount
        if (amount) {
          totals[i] += amount
          amount = roundTwoDecimals(amount)
        }

        if (suggestion.repayScheme[loan.id].accountClosed) {
          closed = ' (Closed)'
        }

        row.push(amount ? formatAmount(amount) + closed : closed ? closed : '-')
        saved += suggestion.repayScheme[loan.id].saved || 0
      } else {
        row.push('-')
      }
    })
    totalSaved += saved
    row.push(
      <Typography fontWeight={500} color='#B6E388'>
        {formatAmount(roundTwoDecimals(saved))}
      </Typography>
    )
    data.push(row)
  })

  const row = [<Typography fontWeight={500}>Total</Typography>]
  loans.forEach((loan, i) => {
    row.push(
      <Typography fontWeight={500}>
        {formatAmount(roundTwoDecimals(totals[i]))}
      </Typography>
    )
  })
  row.push(
    <Typography fontWeight={500} color='#B6E388'>
      {formatAmount(roundTwoDecimals(totalSaved))}
    </Typography>
  )
  data.push(row)

  return data
}
