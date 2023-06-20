import { FileType } from '@/types'
import { Box, IconButton, Typography } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from '@mui/icons-material/Delete'
import { FILES_ID_ROUTE } from '@/services'

const LessonFile = ({
  file,
  isOwner = false,
  onDelete,
}: {
  file: FileType
  isOwner?: boolean
  onDelete: () => void
}) => {
  return (
    <Box
      sx={{
        width: 120,
        p: 2,
        border: '1px solid lightgray',
        borderRadius: 4,
      }}
    >
      <Typography sx={{ height: 50, fontSize: 12 }}>{file.name}</Typography>
      <IconButton
        component='a'
        href={FILES_ID_ROUTE(String(file.id))}
        download={file.name}
      >
        <DownloadIcon />
      </IconButton>
      {isOwner && (
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  )
}

export default LessonFile
