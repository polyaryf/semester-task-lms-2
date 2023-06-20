import axios from 'axios'
import { useEffect, useState } from 'react'
import Nav from '@/components/Nav'
import { Paper, Box, Typography, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useUserContext } from '@/context/userContext'
import { useRouter } from 'next/router'
import { BASE_USERS_ROUTE, USER_ID_ROUTE } from '@/services'
import { LessonStudentType } from '@/types'
import { toast } from 'react-toastify'

const UsersPage = () => {
  const router = useRouter()
  const { user, getUserAuthCfg } = useUserContext()
  const [users, setUsers] = useState<LessonStudentType[]>()

  const fetchUsers = () =>
    axios
      .get(BASE_USERS_ROUTE, getUserAuthCfg())
      .then((res) => setUsers(res.data))

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (!user.role) {
      return
    }
    if (user.role !== 'ADMIN') {
      router.push('/main')
    }
  }, [user.role])

  const onDeleteUserById = (id: string) => {
    axios
      .delete(USER_ID_ROUTE(id), getUserAuthCfg())
      .then(() => toast.success('user deleted'))
      .catch(() => toast.error('error while deleting user'))
      .finally(fetchUsers)
  }

  return (
    <>
      <Nav />
      <Paper sx={{ maxWidth: 1000, mx: 'auto', my: 3, p: 4, borderRadius: 4 }}>
        <Typography variant='h6' sx={{ mb: 1 }}>
          Users:
        </Typography>
        {users?.length === 0 && <Typography>List is empty...</Typography>}
        {users?.map((el) => (
          <Box
            key={el.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1,
              mb: 1,
              border: '1px solid lightgray',
              borderRadius: 5,
            }}
          >
            <Typography>{el.email}</Typography>
            <Box>
              <IconButton onClick={() => onDeleteUserById(String(el.id))}>
                <DeleteIcon color='error' />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Paper>
    </>
  )
}

export default UsersPage
