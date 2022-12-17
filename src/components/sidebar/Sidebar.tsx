import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Drawer, DrawerHeader } from './Sidebar.style'
import { MainListItem, mainListItems } from './data'

type Props = {
  open: boolean
  toggleDrawer: () => void
  handleSection: (section: MainListItem) => void
  section: MainListItem
}

function Sidebar({ open, toggleDrawer, handleSection, section }: Props) {
  return (
    <>
      <Drawer variant='permanent' open={open}>
        <DrawerHeader>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {mainListItems.map((item) => {
            return (
              <ListItem
                key={item.id}
                disablePadding
                sx={{ display: 'block' }}
                selected={item.id === section.id}
              >
                <ListItemButton
                  onClick={handleSection.bind(this, item)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Drawer>
    </>
  )
}

export default Sidebar
