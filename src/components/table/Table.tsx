import { Download } from '@mui/icons-material'
import {
  Paper,
  TableContainer,
  Table as MuiTable,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  Button,
} from '@mui/material'
import { StyledTableCell, StyledTableRow } from './Table.style'
import { extractText } from './util'

type Props = {
  headers: React.ReactNode[]
  rows?: React.ReactNode[][]
  noData?: React.ReactNode
  downloadable?: boolean
  lastRowColor?: string
}

const Table = ({
  headers,
  rows,
  noData,
  downloadable,
  lastRowColor,
}: Props) => {
  const handleCSV = (fileName: string) => {
    const data = [headers]
    if (rows) {
      data.push(...rows)
    }
    const tableData = extractText(data)
      .map((row: unknown[]) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')
    const downloadLink = document.createElement('a')
    const blob = new Blob([tableData])
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = fileName
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  return (
    <>
      {downloadable && (
        <Button
          sx={{ marginBottom: '12px' }}
          onClick={handleCSV.bind(this, 'data.csv')}
          disabled={!(rows && rows.length)}
        >
          <Download /> CSV
        </Button>
      )}
      <TableContainer component={Paper}>
        <MuiTable sx={{ minWidth: 700 }} aria-label='customized table'>
          <TableHead>
            <TableRow>
              {headers.map((header, i) => (
                <StyledTableCell
                  key={`header-${i}`}
                  align={i ? 'right' : 'left'}
                >
                  {header}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows && rows.length ? (
              rows.map((row, i) => (
                <StyledTableRow
                  key={`cell-${i}`}
                  sx={{
                    backgroundColor:
                      i === rows.length - 1 ? lastRowColor : undefined,
                  }}
                >
                  {row.map((cell, j) => (
                    <StyledTableCell
                      align={j ? 'right' : 'left'}
                      component={j ? undefined : 'th'}
                      scope={j ? undefined : 'row'}
                      key={`cell-${i}-${j}`}
                    >
                      {cell}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell align='center' colSpan={headers.length}>
                  <Typography
                    component='p'
                    color='inherit'
                    noWrap
                    sx={{ width: '100%' }}
                    textAlign='center'
                  >
                    {noData || 'No Data.'}
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </>
  )
}

export default Table
