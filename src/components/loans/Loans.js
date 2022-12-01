import { Delete, Edit } from '@mui/icons-material'
import { Button, Stack, Typography, IconButton } from '@mui/material'
import { useState } from 'react'
import { isValid, loanFormInitialValues, parseValues } from './loan-form/util'
import LoanForm from './loan-form/LoanForm'
import dayjs from 'dayjs'
import generateUniqueId from 'generate-unique-id'
import Table from '../table/Table'
import Modal from '../modal/Modal'
import Box from '../box/Box'
import { roundTwoDecimals } from '../helpers/util'

const headers = [
  'Name',
  'Loan amount',
  'Start date',
  'Loan tenure (months)',
  'Interest rate (per anum)',
  'EMI',
  'Pre-payment charges',
  'Pre-payment charges duration',
  'Actions',
]

const getFormInititalValue = () => {
  return {
    ...loanFormInitialValues,
    startDate: dayjs(Date()),
  }
}

const Loans = ({ loans, setLoans }) => {
  const [newLoan, setNewLoan] = useState(getFormInititalValue())
  const [editLoan, setEditLoan] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteLoan, setDeleteLoan] = useState(null)

  const toggleModal = () => {
    setOpen(!open)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditLoan(false)
    setNewLoan(getFormInititalValue)
  }

  const handleDeleteModal = (loan) => {
    setDeleteLoan(loan)
  }

  const handleDeleteLoan = () => {
    if (!deleteLoan) {
      return
    }
    const deletedLoans = [...loans]

    const index = deletedLoans.indexOf(deleteLoan)
    if (index > -1) {
      deletedLoans.splice(index, 1)
    }
    setLoans(deletedLoans)
    handleDeleteModal(null)
  }

  const handleAddEdit = () => {
    if (!isValid(newLoan, setNewLoan)) {
      return
    }
    const parsedLoan = parseValues(newLoan)

    if (newLoan.id) {
      // Edit loan
      const index = loans.findIndex((loan) => loan.id === parsedLoan.id)
      if (index > -1) {
        loans[index] = parsedLoan
        setLoans(loans)
      }
    } else {
      // Add loan
      const loan = {
        id: generateUniqueId({ length: 32 }),
        ...parsedLoan,
      }
      setLoans([...loans, loan])
    }

    handleClose()
  }

  const handleEdit = (loan) => {
    setNewLoan({
      ...loan,
      startDate: dayjs(loan.startDate),
      notValid: loanFormInitialValues.notValid,
    })
    setEditLoan(true)
    toggleModal()
  }

  const getRows = () => {
    return loans.map((loan) => {
      let startDate = dayjs(loan.startDate)
      const date = new Date(startDate.toISOString())
      const month = date.toLocaleString('en-US', {
        month: 'long',
      })

      startDate = `${month} ${startDate.year()}`
      return [
        loan.name ?? '-',
        loan.amount == null ? '-' : roundTwoDecimals(loan.amount),
        startDate ?? '--',
        loan.loanTenure ?? '--',
        loan.interestRate ?? '--',
        loan.emi == null ? '-' : roundTwoDecimals(loan.emi),
        loan.prePaymentCharges ?? '--',
        loan.prePaymentChargesDuration ?? '--',
        <Stack direction='row' spacing={0}>
          <IconButton size='small' onClick={handleEdit.bind(this, loan)}>
            <Edit />
          </IconButton>
          <IconButton
            size='small'
            color='error'
            onClick={handleDeleteModal.bind(this, loan)}
          >
            <Delete color='error' />
          </IconButton>
        </Stack>,
      ]
    })
  }

  return (
    <>
      <Box
        title='Loans'
        actions={
          <Button variant='contained' onClick={handleOpen}>
            + Add
          </Button>
        }
      >
        <Table
          headers={headers}
          rows={getRows()}
          noData='No loans'
          downloadable
        />
      </Box>
      <Modal
        title={`${editLoan ? 'Edit' : 'Add'} Loan`}
        open={open}
        onClose={handleClose}
      >
        <LoanForm
          form={newLoan}
          setForm={setNewLoan}
          handleClose={handleClose}
          handleAdd={handleAddEdit}
          edit={editLoan}
        />
      </Modal>
      <Modal
        title='Delete loan'
        open={!!deleteLoan}
        onClose={handleDeleteModal.bind(this, null)}
      >
        <Typography
          component='p'
          variant='body1'
          color='inherit'
          noWrap
          sx={{ flexGrow: 1 }}
        >
          Are you sure you want to delete <b>{deleteLoan?.name}</b> loan?
        </Typography>
        <Button
          onClick={handleDeleteLoan}
          sx={{ marginTop: '12px' }}
          size='large'
          color='error'
        >
          Delete
        </Button>
      </Modal>
    </>
  )
}

export default Loans
