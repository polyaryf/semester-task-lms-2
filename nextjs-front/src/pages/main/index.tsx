import axios from 'axios'
import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import Nav from '@/components/Nav'
import Lesson from '@/components/Lesson'
import { useUserContext } from '@/context/userContext'
import { BASE_LESSON_ROUTE, LESSON_ID_ROUTE } from '@/services'
import { LessonType } from '@/types'
import { toast } from 'react-toastify'

export default function Home() {
  const [lessons, setLessons] = useState<null | LessonType[]>(null)
  const { user, getUserAuthCfg } = useUserContext()

  const fetchLesson = () =>
    axios.get(BASE_LESSON_ROUTE, getUserAuthCfg()).then((res) => {
      setLessons(res.data as LessonType[])
    })

  useEffect(() => {
    if (!user.token) {
      return
    }
    fetchLesson()
  }, [user.token])

  const onDeleteLessonById = (id: string) => {
    axios
      .delete(LESSON_ID_ROUTE(id), getUserAuthCfg())
      .then((res) => {
        if (res.status === 200) {
          toast.success('delete success')
        }
      })
      .catch(() => toast.error('Error while delete lesson'))
      .finally(fetchLesson)
  }

  return (
    <>
      <Nav />
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 4 }}>
        {lessons == null && <Typography>Loading...</Typography>}
        {lessons?.length === 0 && (
          <Typography>You don&apos;t have any lessons...</Typography>
        )}
        {lessons?.map((lesson) => (
          <Lesson
            key={lesson.id}
            lesson={lesson}
            isAdmin={user.role === 'ADMIN'}
            onDelete={() => onDeleteLessonById(String(lesson.id))}
          />
        ))}
      </Box>
    </>
  )
}
