import { Typography } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'
import { Loan, RepayScheme } from '../helpers'
import { formatAmount } from '../helpers/format'
import { getEntireSuggestions } from '../helpers/suggestions'
import { roundTwoDecimals } from '../helpers/util'

export type SuggestionInitialValues = {
  repayAmount?: number
  repayStartDate: dayjs.Dayjs
  notValid: {
    repayAmount: boolean
    repayStartDate: boolean
  }
}

export const suggestionInitialValues: SuggestionInitialValues = {
  repayAmount: undefined,
  repayStartDate: dayjs(Date()),
  notValid: {
    repayAmount: false,
    repayStartDate: false,
  },
}

export const formatLocalStorage = (
  data: Record<keyof Omit<SuggestionInitialValues, 'notValid'>, string>
) => {
  return {
    repayAmount: formatValue('repayAmount', data.repayAmount) as number,
    repayStartDate: dayjs(data.repayStartDate),
    notValid: {
      ...suggestionInitialValues.notValid,
    },
  }
}

export const formatValue = (
  name: keyof Omit<SuggestionInitialValues, 'notValid'>,
  value: string
) => {
  if (name === 'repayAmount') {
    return parseFloat(value)
  }

  return value
}

export const getRepayScheduleHeaders = (loans: Loan[]) => {
  return ['Month', ...loans.map((loan) => loan.name), 'Saved']
}

export const getRepaySchedule = (
  loans: Loan[],
  repay: Omit<SuggestionInitialValues, 'notValid'>
) => {
  const suggestions = getEntireSuggestions(
    loans,
    repay.repayAmount || 0,
    new Date(repay.repayStartDate.toISOString())
  )
  let totalSaved = 0
  const data = []
  const totals: { [index: number]: number } = {}
  suggestions.forEach((suggestion, i) => {
    const month = suggestion.date.toLocaleString('en-US', {
      month: 'long',
    })
    const year = suggestion.date.getFullYear()
    const row: React.ReactNode[] = [`${month} ${year}`]
    let saved = 0
    loans.forEach((loan, i) => {
      if (!totals[i]) {
        totals[i] = 0
      }

      if (!loan.id) {
        return
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

        row.push(amount ? formatAmount(amount) + closed : closed || '-')
        saved += suggestion.repayScheme[loan.id].saved || 0
      } else {
        row.push('-')
      }
    })
    totalSaved += saved
    row.push(
      <Typography key={`suggestion-${i}`} fontWeight={500} color='#B6E388'>
        {formatAmount(roundTwoDecimals(saved))}
      </Typography>
    )
    data.push(row)
  })

  const row = [
    <Typography key={'total-00'} fontWeight={500}>
      Total
    </Typography>,
  ]
  loans.forEach((loan, i) => {
    row.push(
      <Typography key={`total-${i}`} fontWeight={500}>
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
