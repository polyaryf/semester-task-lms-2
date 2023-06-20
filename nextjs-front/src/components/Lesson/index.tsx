import { LessonType } from '@/types'
import { apiDateToRelFormat } from '@/utils'
import { Paper, Typography, Box, IconButton } from '@mui/material'
import Link from 'next/link'
import DeleteIcon from '@mui/icons-material/Delete'

const Lesson = ({
  lesson,
  isAdmin = false,
  onDelete,
}: {
  lesson: LessonType
  isAdmin?: boolean
  onDelete?: () => void
}) => {
  return (
    <Paper
      elevation={0}
      key={lesson.id}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        mb: 1,
        borderRadius: 5,
      }}
    >
      <Box>
        <Link href={`/lesson/${lesson.id}`}>
          <Typography>{lesson.name}</Typography>
        </Link>
        <Typography>{apiDateToRelFormat(lesson.start)}</Typography>
      </Box>
      {isAdmin && (
        <Box>
          <IconButton onClick={onDelete}>
            <DeleteIcon color='error' />
          </IconButton>
        </Box>
      )}
    </Paper>
  )
}

export default Lesson
