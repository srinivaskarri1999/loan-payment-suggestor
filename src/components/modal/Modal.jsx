import {
  Box,
  Divider,
  Modal as MuiModal,
  Stack,
  Typography,
  IconButton,
} from '@mui/material'
import { Close } from '@mui/icons-material'

const Modal = ({ open, onClose, title, children }) => {
  return (
    <MuiModal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
        }}
      >
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
          <IconButton onClick={onClose} color='lightgray'>
            <Close />
          </IconButton>
        </Stack>
        <Divider sx={{ mt: 1, mb: 2 }} />
        {children}
      </Box>
    </MuiModal>
  )
}

export default Modal
