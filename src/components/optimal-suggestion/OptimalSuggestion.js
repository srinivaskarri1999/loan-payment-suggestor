import { Container, Grid } from '@mui/material'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Loans from '../loans/Loans'
import Suggestion from '../suggestion/Suggestion'

const OptimalSuggestion = () => {
  const [loans, setLoans] = useLocalStorage('_loans', [])

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Grid
        container
        rowSpacing={{ xs: 3, md: 4, xl: 5 }}
        columnSpacing={{ xs: 0 }}
      >
        <Grid item xs={12}>
          <Loans loans={loans} setLoans={setLoans} />
        </Grid>
        <Grid item xs={12}>
          <Suggestion loans={loans} />
        </Grid>
      </Grid>
    </Container>
  )
}

export default OptimalSuggestion
