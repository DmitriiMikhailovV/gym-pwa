import { TextField, TextFieldProps, styled } from '@mui/material'

const StyledTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& .MuiFilledInput-root': {
    borderRadius: '10px',
    backgroundColor: 'rgba(118, 118, 128, 0.24)',
    '&:before, &:after': { display: 'none' },
    '&.Mui-focused': {
      backgroundColor: 'rgba(118, 118, 128, 0.24)',
    },
    '&:hover': {
      backgroundColor: 'rgba(118, 118, 128, 0.3)',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
}))

export const Input = (props: TextFieldProps) => {
  return <StyledTextField variant="filled" fullWidth {...props} />
}
