import { Button, FormControl, Grid, Stack, TextField } from '@mui/material'
import Box from '../box/Box'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import {
  formatLocalStorage,
  formatValue,
  getRepaySchedule,
  getRepayScheduleHeaders,
  SuggestionInitialValues,
  suggestionInitialValues,
} from './util'
import Table from '../table/Table'
import React, { ChangeEvent, useState } from 'react'
import { Loan } from '../helpers'

const Suggestion = ({ loans }: { loans: Loan[] }) => {
  const [form, setForm] = useLocalStorage<
    SuggestionInitialValues,
    Record<keyof Omit<SuggestionInitialValues, 'notValid'>, string>
  >('_suggestionInputs', suggestionInitialValues, formatLocalStorage)
  const [tableHeaders, setTableHeaders] = useState<React.ReactNode[]>([])
  const [tableData, setTableData] = useState<React.ReactNode[][]>()

  const handleChange =
    (name: keyof Omit<SuggestionInitialValues, 'notValid'>) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | null) => {
      let value
      if (e && e.currentTarget) {
        value = e.currentTarget.value
      } else {
        value = e
      }

      setForm({
        ...form,
        [name]: formatValue(name, value as string),
      })
    }

  const isValid = () => {
    let valid = true
    const notValid = { ...suggestionInitialValues.notValid }

    if (!form.repayAmount || isNaN(form.repayAmount)) {
      valid = false
      notValid.repayAmount = true
    }

    if (!form.repayStartDate) {
      valid = false
      notValid.repayAmount = true
    }

    setForm({ ...form, notValid })
    return valid
  }

  const handleCalculate = () => {
    if (!isValid()) {
      return
    }
    const { notValid, ...parsedForm } = { ...form }
    const repaySchedule = getRepaySchedule(loans, parsedForm)
    const repayScheduleHeaders = getRepayScheduleHeaders(loans)
    setTableHeaders(repayScheduleHeaders)
    setTableData(repaySchedule)
  }

  return (
    <Box title='Repayment schedule'>
      <Grid container rowSpacing={{ xs: 2 }}>
        <Grid item xs={12}>
          <Stack direction='row' spacing={3}>
            <FormControl>
              <TextField
                label='Extra amount'
                type='number'
                value={form.repayAmount}
                onChange={handleChange('repayAmount')}
                error={form.notValid.repayAmount}
                InputLabelProps={{
                  shrink: true,
                }}
                required
                helperText='Additional amount excluding EMI'
              />
            </FormControl>
            <FormControl>
              <DatePicker
                label='Start date'
                openTo='year'
                views={['year', 'month']}
                value={form.repayStartDate}
                onChange={handleChange('repayStartDate')}
                renderInput={(params) => <TextField {...params} />}
              />
            </FormControl>
            <Button
              onClick={handleCalculate}
              disabled={!loans || loans.length === 0}
              variant='contained'
              sx={{ height: '50px' }}
            >
              Calcutale
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          {loans &&
            tableHeaders &&
            loans.length > 0 &&
            tableHeaders.length > 0 && (
              <Table
                headers={tableHeaders}
                rows={tableData}
                noData='No Data.'
                downloadable
                lastRowColor='rgba(51, 153, 255, 0.16)'
              />
            )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Suggestion
