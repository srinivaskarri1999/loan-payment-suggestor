import { Button, FormControl, Grid, Stack, TextField } from '@mui/material'
import Box from '../box/Box'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import {
  getRepaySchedule,
  getRepayScheduleHeaders,
  parseValues,
  suggestionInitialValues,
} from './util'
import Table from '../table/Table'
import { useState } from 'react'

const Suggestion = ({ loans }) => {
  const [form, setForm] = useLocalStorage('_suggestionInputs', {
    ...suggestionInitialValues,
    repayStartDate: dayjs(Date()),
  })
  const [tableHeaders, setTableHeaders] = useState([])
  const [tableData, setTableData] = useState()

  const handleChange = (name) => (e) => {
    let value = e
    if (e.target) {
      value = e.target.value
    }

    setForm({
      ...form,
      [name]: value,
    })
  }

  const isValid = () => {
    let valid = true
    const notValid = { ...suggestionInitialValues.notValid }

    if (!form.repayAmount && !isNaN(form.repayAmount)) {
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
    const parsedForm = parseValues(form)
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
                label='Repay amount'
                type='number'
                value={form.repayAmount}
                onChange={handleChange('repayAmount')}
                error={form.notValid.repayAmount}
                InputLabelProps={{
                  shrink: true,
                }}
                required
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
                required
              />
            </FormControl>
            <Button
              onClick={handleCalculate}
              disabled={!loans || loans.length === 0}
              variant='contained'
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
              />
            )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Suggestion
