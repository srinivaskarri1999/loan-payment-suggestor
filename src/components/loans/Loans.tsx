import { Delete, Edit } from '@mui/icons-material'
import { Button, Stack, Typography, IconButton } from '@mui/material'
import { useState } from 'react'
import {
  isValid,
  LoanFormInitialValues,
  loanFormInitialValues,
} from './loan-form/util'
import LoanForm from './loan-form/LoanForm'
import dayjs from 'dayjs'
import generateUniqueId from 'generate-unique-id'
import Table from '../table/Table'
import Modal from '../modal/Modal'
import Box from '../box/Box'
import { formatAmount, formatInterestRate } from '../helpers/format'
import { Loan } from '../helpers'

type Props = {
  loans: Loan[]
  setLoans: (loans: Loan[]) => void
}

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

const Loans = ({ loans, setLoans }: Props) => {
  const [newLoan, setNewLoan] = useState<LoanFormInitialValues>(
    loanFormInitialValues
  )
  const [editLoan, setEditLoan] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [deleteLoan, setDeleteLoan] = useState<Loan | null>(null)

  const toggleModal = () => {
    setOpen(!open)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditLoan(false)
    setNewLoan(loanFormInitialValues)
  }

  const handleDeleteModal = (loan: Loan | null) => {
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
    const { notValid, ...parseLoan } = { ...newLoan }
    const isEdit = !!newLoan.id

    if (isEdit) {
      // Edit loan
      const index = loans.findIndex((loan) => loan.id === newLoan.id)
      if (index > -1) {
        loans[index] = parseLoan
        setLoans(loans)
      }
    } else {
      // Add loan
      const loan = {
        id: generateUniqueId({ length: 32 }),
        ...parseLoan,
      }
      setLoans([...loans, loan])
    }

    handleClose()
  }

  const handleEdit = (loan: Loan) => {
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
      const startDate = dayjs(loan.startDate)
      const date = new Date(startDate.toISOString())
      const month = date.toLocaleString('en-US', {
        month: 'long',
      })

      const startDateString = `${month} ${startDate.year()}`
      return [
        loan.name ?? '-',
        formatAmount(loan.amount),
        startDateString ?? '--',
        loan.loanTenure ?? '--',
        formatInterestRate(loan.interestRate),
        formatAmount(loan.emi),
        formatInterestRate(loan.prePaymentCharges),
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
