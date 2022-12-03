import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useEffect, useState } from 'react'
import { calculateEmi } from '../../helpers/loans'

const LoanForm = ({ form, setForm, handleClose, handleAdd, edit }) => {
  const [emiChanged, setEmiChanged] = useState(false)

  useEffect(() => {
    if (!emiChanged && form.amount && form.interestRate && form.loanTenure) {
      setForm({
        ...form,
        emi: calculateEmi(form.amount, form.interestRate, form.loanTenure),
      })
    }
  }, [
    form.amount,
    form.interestRate,
    form.loanTenure,
    emiChanged,
    form,
    setForm,
  ])

  const handleChange = (name) => (e) => {
    if (name === 'emi') {
      setEmiChanged(true)
    }

    let value = e
    if (e.target) {
      value = e.target.value
    }

    setForm({
      ...form,
      [name]: value,
    })
  }

  const getAdornment = (name) => {
    switch (name) {
      case 'amount': {
        return <InputAdornment position='start'>₹</InputAdornment>
      }
      case 'loanTenure': {
        return <InputAdornment position='start'>Mo</InputAdornment>
      }
      case 'interestRate': {
        return <InputAdornment position='start'>%</InputAdornment>
      }
      case 'emi': {
        return <InputAdornment position='start'>₹</InputAdornment>
      }
      case 'prePaymentCharges': {
        return <InputAdornment position='start'>%</InputAdornment>
      }
      case 'prePaymentChargesDuration': {
        return <InputAdornment position='start'>Mo</InputAdornment>
      }
      default: {
        return <></>
      }
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <TextField
            label='Name'
            value={form.name}
            onChange={handleChange('name')}
            error={form.notValid.name}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel htmlFor='outlined-adornment-loan-amount'>
            Loan amount *
          </InputLabel>
          <OutlinedInput
            id='outlined-adornment-loan-amount'
            type='number'
            label='Loan amount'
            value={form.amount}
            startAdornment={getAdornment('amount')}
            onChange={handleChange('amount')}
            error={form.notValid.amount}
            required
          />
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <DatePicker
            label='Start date'
            openTo='year'
            views={['year', 'month']}
            value={form.startDate}
            onChange={handleChange('startDate')}
            renderInput={(params) => (
              <TextField
                {...params}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
            required
          />
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel htmlFor='outlined-adornment-loan-tenure'>
            Loan tenure *
          </InputLabel>
          <OutlinedInput
            id='outlined-adornment-loan-tenure'
            label='Loan tenure'
            type='number'
            value={form.loanTenure}
            startAdornment={getAdornment('loanTenure')}
            onChange={handleChange('loanTenure')}
            error={form.notValid.loanTenure}
            required
          />
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel htmlFor='outlined-adornment-interest-rate'>
            Interest rate (per anum) *
          </InputLabel>
          <OutlinedInput
            id='outlined-adornment-interest-rate'
            label='Interest rate (per anum)'
            value={form.interestRate}
            type='number'
            startAdornment={getAdornment('interestRate')}
            onChange={handleChange('interestRate')}
            error={form.notValid.interestRate}
            required
          />
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel htmlFor='outlined-adornment-emi'>EMI</InputLabel>
          <OutlinedInput
            id='outlined-adornment-interest-rate'
            label='EMI'
            type='number'
            value={form.emi}
            startAdornment={getAdornment('emi')}
            onChange={handleChange('emi')}
            error={form.notValid.emi}
          />
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel htmlFor='outlined-pre-payment-charges'>
            Pre-payment charges
          </InputLabel>
          <OutlinedInput
            id='outlined-pre-payment-charges'
            label='Pre-payment charges'
            type='number'
            value={form.prePaymentCharges}
            startAdornment={getAdornment('prePaymentCharges')}
            onChange={handleChange('prePaymentCharges')}
            error={form.notValid.prePaymentCharges}
          />
          <FormHelperText>
            Charges applicable on pre-payments to principle amount
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel htmlFor='outlined-pre-payment-charges'>
            Pre-payment charges duration
          </InputLabel>
          <OutlinedInput
            label='Pre-payment charges duration'
            type='number'
            value={form.prePaymentChargesDuration}
            startAdornment={getAdornment('prePaymentChargesDuration')}
            onChange={handleChange('prePaymentChargesDuration')}
            error={form.notValid.prePaymentChargesDuration}
          />
          <FormHelperText>
            Duration untill the charges are applicable
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={1} />
      <Grid item xs={4}>
        <Button onClick={handleAdd} variant='contained' fullWidth>
          {edit ? 'Save' : 'Add'}
        </Button>
      </Grid>
      <Grid item xs={2} />
      <Grid item xs={4}>
        <Button
          onClick={handleClose}
          variant='outline'
          sx={{ border: 'solid white 1px' }}
          fullWidth
        >
          Cancel
        </Button>
      </Grid>
    </Grid>
  )
}

export default LoanForm
