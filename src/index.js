import React from 'react'
import ReactDOM from 'react-dom/client'
import { createTheme, ThemeProvider } from '@mui/material'
import App from './components/app/App'
import { theme } from './data'

const mdTheme = createTheme(theme)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ThemeProvider theme={mdTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
