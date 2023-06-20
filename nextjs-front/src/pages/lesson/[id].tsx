import LessonFile from '@/components/LessonFile'
import LessonUploadButton from '@/components/LessonUploadButton'
import Line from '@/components/Line'
import Nav from '@/components/Nav'
import { useUserContext } from '@/context/userContext'
import {
  ENROLL_USER_ROUTE,
  FILES_ID_ROUTE,
  FILES_LESSON_ID_ROUTE,
  LESSON_ID_ROUTE,
  USERS_BY_LESSON_ID_ROUTE,
} from '@/services'
import { FileType, LessonStudentType, LessonType } from '@/types'
import { apiDateToRelFormat } from '@/utils'
import {
  Button,
  Paper,
  TextField,
  Typography,
  Box,
  IconButton,
} from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { ChangeEvent, useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'

const LessonPage = () => {
  const [students, setStudents] = useState<LessonStudentType[]>()
  const [files, setFiles] = useState<FileType[]>()
  const [isEdit, setIsEdit] = useState(false)
  const [lessonInfo, setLessonInfo] = useState<LessonType>()
  const { user, getUserAuthCfg } = useUserContext()
  const isTeacher = String(user.userId) === String(lessonInfo?.creatorId)
  const router = useRouter()
  const id = router.query.id
  const lessonId = lessonInfo ? String(lessonInfo?.id) : String(id)
  const isUserEnrolled = students
    ? students.some((el) => String(el.id) === String(user.userId))
    : false

  const fetchLessonData = () => {
    axios
      .get(LESSON_ID_ROUTE(lessonId), getUserAuthCfg())
      .then(
        (res) => res.status === 200 && setLessonInfo(res.data as LessonType)
      )
      .catch(() => toast.error('Error while fetching lesson data'))
  }
  const fetchStudents = () => {
    axios
      .get(USERS_BY_LESSON_ID_ROUTE(lessonId), getUserAuthCfg())
      .then((res) => setStudents(res.data as LessonStudentType[]))
      .catch(() => toast.error('Error while fetching lesson students'))
  }
  const fetchFiles = () => {
    axios
      .get(FILES_LESSON_ID_ROUTE(lessonId), getUserAuthCfg())
      .then((res) => {
        setFiles(res.data)
        toast.success('filles fetched')
      })
      .catch(() => toast.error('Error while fetching lesson files'))
  }

  useEffect(() => {
    if (!id || !user.token) {
      return
    }
    fetchLessonData()
    fetchFiles()
    fetchStudents()
  }, [id, user.token])

  const onEditAndSaveClick = () => {
    if (!isEdit) {
      setIsEdit(true)
      return
    }
    axios
      .put(
        LESSON_ID_ROUTE(lessonId),
        {
          name: lessonInfo?.name,
          description: lessonInfo?.description,
        },
        getUserAuthCfg()
      )
      .then((res) => res.status === 200 && toast.success('Lesson updated'))
      .catch(() => {
        toast.error('Error while update Lesson')
      })
      .finally(() => {
        setIsEdit(false)
        fetchLessonData()
      })
  }

  const onFieldChange =
    (name: keyof LessonType) => (e: ChangeEvent<HTMLInputElement>) => {
      if (!isEdit) {
        return
      }
      setLessonInfo((i) => {
        if (i) {
          return {
            ...i,
            [name]: e.target.value,
          }
        }
      })
    }

  const onDeleteClick = () => {
    axios
      .delete(LESSON_ID_ROUTE(lessonId), getUserAuthCfg())
      .then((res) => {
        if (res.status === 200) {
          toast.success('delete success')
          router.push('/lessons')
        }
      })
      .catch(() => toast.error('Error while delete lesson'))
  }

  const onEnrollorExitClick = () => {
    if (isUserEnrolled) {
      axios
        .delete(ENROLL_USER_ROUTE(user.userId, lessonId), getUserAuthCfg())
        .then((res) => {
          res.status === 200 && toast.success('you leave class')
        })
        .catch(() => toast.error('error while leaving class'))
        .finally(fetchStudents)
      return
    }
    axios
      .post(ENROLL_USER_ROUTE(user.userId, lessonId), {}, getUserAuthCfg())
      .then((res) => {
        res.status === 200 && toast.success('Enroll success')
      })
      .catch(() => toast.error('Error while entering class'))
      .finally(fetchStudents)
  }

  const onFileUpload = (data: FormData) => {
    const headers = getUserAuthCfg().headers || {}
    axios
      .post(FILES_ID_ROUTE(lessonId), data, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res.status === 200 && toast.success('upload success'))
      .catch(() => toast.error('upload file error'))
      .finally(fetchFiles)
  }

  const onFileDelete = (id: string) => {
    axios
      .delete(FILES_ID_ROUTE(id), getUserAuthCfg())
      .then((res) => res.status === 200 && toast.success('file deleted'))
      .catch(() => toast.error('delete file error'))
      .finally(fetchFiles)
  }

  const onDeleteStudentById = (id: string) => {
    axios
      .delete(ENROLL_USER_ROUTE(id, lessonId), getUserAuthCfg())
      .then((res) => {
        res.status === 200 && toast.success('Student deleted')
      })
      .catch(() => toast.error('Student delete error'))
      .finally(fetchStudents)
  }

  return (
    <>
      <Nav />
      <Paper
        sx={{
          maxWidth: 1000,
          p: 2,
          m: 2,
          mx: 'auto',
          borderRadius: 4,
        }}
      >
        <Line>
          <Typography sx={{ width: 70 }}>Name:</Typography>
          <TextField
            value={lessonInfo?.name}
            onChange={onFieldChange('name')}
          />
        </Line>
        <Line>
          <Typography sx={{ width: 70 }}>Starts:</Typography>
          <TextField
            value={apiDateToRelFormat(lessonInfo?.start || '')}
            disabled
          />
        </Line>
        <Line>
          <Typography sx={{ width: 70 }}>Description:</Typography>
          <TextField
            value={lessonInfo?.description}
            onChange={onFieldChange('description')}
          />
        </Line>
        <Line>
          <Typography sx={{ width: 70 }}>Owner:</Typography>
          <Typography>{isTeacher ? 'Yes' : 'No'}</Typography>
        </Line>
        <Line>
          <Typography sx={{ width: 70 }}>Files:</Typography>
          <Typography component='h5'>{files?.length}</Typography>
        </Line>
        {(isUserEnrolled || isTeacher) && (
          <Paper elevation={0} sx={{ display: 'flex', gap: 2 }}>
            {files?.map((file) => (
              <LessonFile
                key={`lesson-file-${file.id}`}
                file={file}
                isOwner={isTeacher}
                onDelete={() => onFileDelete(String(file.id))}
              />
            ))}
          </Paper>
        )}
        {!isTeacher && (
          <Line sx={{ pt: 2 }}>
            <Button
              variant='contained'
              color={isUserEnrolled ? 'error' : 'success'}
              onClick={onEnrollorExitClick}
            >
              {isUserEnrolled ? 'Leave class' : 'Enter class'}
            </Button>
          </Line>
        )}
        {isTeacher && (
          <Line sx={{ pt: 3, gap: 2 }}>
            <Button variant='contained' onClick={onEditAndSaveClick}>
              {isEdit ? 'Save' : 'Edit'}
            </Button>
            <Button variant='contained' color='error' onClick={onDeleteClick}>
              Delete
            </Button>
            <LessonUploadButton onUpload={onFileUpload} />
          </Line>
        )}
      </Paper>
      <Paper sx={{ maxWidth: 1000, p: 2, m: 2, mx: 'auto', borderRadius: 4 }}>
        <Typography variant='h5'>Students:</Typography>
        {students?.length === 0 && (
          <Typography sx={{ p: 1 }}>No students...</Typography>
        )}
        {students?.map((el) => (
          <Box
            key={`student-box-${el.id}`}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid lightgray',
              borderRadius: 2,
              p: 1,
              m: 1,
            }}
          >
            <Typography>login: {el.email}</Typography>
            {isTeacher && (
              <IconButton onClick={() => onDeleteStudentById(String(el.id))}>
                <DeleteIcon color='error' />
              </IconButton>
            )}
          </Box>
        ))}
      </Paper>
    </>
  )
}

export default LessonPage
