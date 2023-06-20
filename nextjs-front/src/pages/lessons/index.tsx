import axios from 'axios'
import { useState, useEffect, ChangeEvent } from 'react'
import { toast } from 'react-toastify'
import Nav from '@/components/Nav'
import Line from '@/components/Line'
import Lesson from '@/components/Lesson'
import { Paper, Button, TextField, Box, Typography } from '@mui/material'
import { useUserContext } from '@/context/userContext'
import { BASE_LESSON_ROUTE } from '@/services'
import { LessonType } from '@/types'
import DateTimePicker from '@/components/DateTimePicker'

const Lessons = () => {
  const { user, getUserAuthCfg } = useUserContext()
  const [lessons, setLessons] = useState<LessonType[] | null>(null)
  const [refetchLessons, setRefetchLessons] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [start, setStart] = useState('')
  const [errors, setErrors] = useState({ name: '', start: '', description: '' })

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    setErrors((e) => ({
      ...e,
      name: name.length < 3 ? 'name must be longer' : '',
    }))
  }

  const onDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDescription(value)
    setErrors((e) => ({
      ...e,
      description: description.length < 5 ? 'description must be longer' : '',
    }))
  }

  const fetchLessonsList = () => {
    axios
      .get(BASE_LESSON_ROUTE, getUserAuthCfg())
      .then((res) => {
        if (res.status === 200 && res.data) {
          const onlyOwnerLessons = (res.data as LessonType[]).filter((el) => {
            return String(el.creatorId) === String(user.userId)
          })
          setLessons(onlyOwnerLessons)
        }
      })
      .finally(() => {
        setRefetchLessons(false)
      })
  }

  useEffect(() => {
    if (refetchLessons && user) {
      fetchLessonsList()
    }
  }, [refetchLessons, user])

  const onCreateLesson = () => {
    axios
      .post(
        BASE_LESSON_ROUTE,
        {
          name,
          description,
          start,
          creatorId: user.userId,
        },
        getUserAuthCfg()
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success('lesson created')
          setRefetchLessons(true)
        }
      })
      .catch(() => toast.error('error happend'))
  }

  return (
    <>
      <Nav />
      <Paper
        elevation={2}
        sx={{
          maxWidth: 1000,
          mx: 'auto',
          my: 3,
          px: 3,
          py: 3,
          borderRadius: 4,
        }}
      >
        <Line sx={{ mb: 0 }}>
          <TextField
            label='name'
            autoComplete='off'
            value={name}
            error={Boolean(errors.name)}
            helperText={errors.name}
            onChange={onNameChange}
          ></TextField>
          <TextField
            label='description'
            autoComplete='off'
            value={description}
            error={Boolean(errors.description)}
            helperText={errors.description}
            onChange={onDescriptionChange}
          ></TextField>
          <DateTimePicker
            label='start'
            error={Boolean(errors.start)}
            helperText={errors.start}
            onError={(msg: string) => setErrors((e) => ({ ...e, start: msg }))}
            onChange={setStart}
          />
          <Button
            variant='contained'
            disabled={Boolean(
              errors.description || errors.name || errors.start
            )}
            onClick={onCreateLesson}
          >
            Create Lesson
          </Button>
        </Line>
      </Paper>
      <Box sx={{ maxWidth: 1030, mx: 'auto', p: 2 }}>
        {lessons?.length === 0 && (
          <Typography sx={{ textAlign: 'center' }}>
            You don&apos;t have any lessons...
          </Typography>
        )}
        {lessons?.map((lesson) => (
          <Lesson key={lesson.id} lesson={lesson} />
        ))}
      </Box>
    </>
  )
}

export default Lessons
