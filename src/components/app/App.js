import { Box, CssBaseline } from '@mui/material'
import { useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { mainListItems } from '../sidebar/data'
import Sidebar from '../sidebar/Sidebar'
import { DrawerHeader } from '../sidebar/Sidebar.style'
import Topbar from '../topbar/Topbar'

const App = () => {
  const [open, setOpen] = useState(true)
  const [section, setSection] = useState(mainListItems[0])

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const handleSection = (section) => {
    setSection(section)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Topbar open={open} toggleDrawer={toggleDrawer} title={section.title} />
        <Sidebar
          open={open}
          toggleDrawer={toggleDrawer}
          handleSection={handleSection}
          section={section}
        />
        <Box component='main' sx={{ flexGrow: 1 }}>
          <DrawerHeader />
          {section.component}
        </Box>
      </Box>
    </LocalizationProvider>
  )
}

export default App
