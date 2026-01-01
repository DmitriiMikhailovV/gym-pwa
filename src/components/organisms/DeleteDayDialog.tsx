import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import { Button } from '../atoms/Button'
import { useTranslation } from 'react-i18next'

interface DeleteDayDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export const DeleteDayDialog = ({ open, onClose, onConfirm }: DeleteDayDialogProps) => {
  const { t } = useTranslation()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-day-dialog-title"
      aria-describedby="delete-day-dialog-description"
      PaperProps={{
        sx: { borderRadius: '14px', bgcolor: 'background.paper', backgroundImage: 'none' },
      }}
    >
      <DialogTitle id="delete-day-dialog-title" sx={{ fontWeight: 700 }}>
        {t('stats.deleteDay')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-day-dialog-description">
          {t('stats.deleteDayConfirm')}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: 'text.primary',
          }}
        >
          {t('workout.cancel')}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          {t('stats.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
