import { Box, BoxProps } from '@mui/material'

export const Line = ({ children, sx = {} }: BoxProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        mb: 2,
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export default Line
