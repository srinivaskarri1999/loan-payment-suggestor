import { Divider, Paper, Stack, Typography } from "@mui/material"

const Box = ({children, actions, title}) => {
  return (
    <Paper elevation={6} sx={{ padding: '24px', paddingBottom: '64px' }}>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        spacing={1}
      >
        <Typography
          component='h1'
          variant='h6'
          color='inherit'
          noWrap
          sx={{ flexGrow: 1 }}
        >
          {title}
        </Typography>
        {actions}
      </Stack>
      <Divider sx={{ mt: 1, mb: 2 }} />
      {children}
    </Paper>
  )
}

export default Box