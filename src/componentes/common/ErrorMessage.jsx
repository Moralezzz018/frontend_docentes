import { Alert, AlertTitle, Box } from '@mui/material'

const ErrorMessage = ({ error, title = 'Error' }) => {
  return (
    <Box sx={{ my: 2 }}>
      <Alert severity="error">
        <AlertTitle>{title}</AlertTitle>
        {error}
      </Alert>
    </Box>
  )
}

export default ErrorMessage
