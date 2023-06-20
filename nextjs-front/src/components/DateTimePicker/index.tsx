import { Typography, Box } from '@mui/material'
import { DateTimePicker as DTP } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

const DateTimePicker = ({
  onChange,
  onError,
  label,
  helperText,
  error = false,
}: {
  onChange: (s: string) => void
  onError: (s: string) => void
  error?: boolean
  label?: string
  helperText?: string
}) => {
  const onDTPChange = (object: { ['$d']: Date } | null) => {
    if (!object) {
      return
    }
    let value = null
    try {
      value = object['$d'].toISOString()
    } catch {
      onError('wrong date')
      return
    }
    if (value) {
      onError('')
      onChange(value)
    }
  }

  return (
    <Box sx={{ position: 'realative' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DTP label={label} onChange={onDTPChange} />
      </LocalizationProvider>
      {error && (
        <Typography
          sx={{ position: 'absolute', fontSize: 12, mt: '3px' }}
          color='error'
        >
          {helperText}
        </Typography>
      )}
    </Box>
  )
}

export default DateTimePicker
