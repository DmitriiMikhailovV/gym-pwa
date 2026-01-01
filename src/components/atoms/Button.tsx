import { Button as MuiButton, ButtonProps, styled } from '@mui/material'

const StyledButton = styled(MuiButton)<ButtonProps>(() => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '17px',
  padding: '12px 16px',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
}))

export const Button = (props: ButtonProps) => {
  return <StyledButton {...props} />
}
