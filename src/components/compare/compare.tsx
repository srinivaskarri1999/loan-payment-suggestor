import { Construction } from '@mui/icons-material'
import { Container, Grid, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

const Compare = () => {
  const [dots, setDots] = useState<string>('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDots(dots.length === 5 ? '.' : dots + '.')
    }, 500)
    return () => {
      clearTimeout(timer)
    }
  }, [dots])

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Grid
        container
        rowSpacing={{ xs: 3, md: 4, xl: 5 }}
        columnSpacing={{ xs: 0 }}
      >
        <Grid item xs={12}>
          <Stack
            direction='column'
            justifyContent='space-between'
            alignItems='center'
            spacing={2}
          >
            <Construction sx={{ fontSize: '64px' }} />
            <Typography
              component='h1'
              variant='h6'
              color='inherit'
              noWrap
              sx={{ flexGrow: 1, fontSize: '32px' }}
            >
              Under Construction{dots}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Compare
