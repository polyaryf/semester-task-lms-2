import { useUserContext } from '@/context/userContext'
import { LOGIN_ROUTE, SIGN_IN_ROUTE } from '@/services'
import { RoleType, UserType } from '@/types'
import { validateEmail } from '@/utils'
import {
  Paper,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
} from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function Home() {
  const router = useRouter()
  const { setUser } = useUserContext()
  const [error, setError] = useState({ email: '' })
  const [isReg, setIsReg] = useState(true)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<RoleType>('STUDENT')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!email) {
      return
    }
    setError({
      email: validateEmail(email) ? '' : 'Wrong email',
    })
  }, [email])

  const onAuth = () => {
    if (!email || !role || !password) {
      return
    }
    if (isReg) {
      axios
        .post(SIGN_IN_ROUTE, {
          email,
          password,
          role,
        })
        .then((res) => {
          if (res.status === 200) {
            toast.success('Successfull sign in')
            setIsReg(false)
          }
        })
        .catch(() => toast.error('Sign in error'))
    }
    if (!isReg) {
      axios
        .post(LOGIN_ROUTE, {
          email,
          password
        })
        .then((res) => {
          if (res.status === 200 && res.data) {
            setUser(res.data as UserType)
            toast.success('Successfull login')
            router.push('/main')
          }
        })
        .catch(() => toast.error('Login error'))
    }
  }

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          px: 2,
          py: 3,
          width: 400,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 3,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: 8,
        }}
      >
        <Typography variant='h4'>{isReg ? 'Sign In' : 'Login'}</Typography>
        <TextField
          error={Boolean(error.email)}
          helperText={error.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value as RoleType)}
          className={isReg ? '' : 'hide-field'}
          disabled={!isReg}
        >
          <MenuItem value='STUDENT'>STUDENT</MenuItem>
          <MenuItem value='TEACHER'>TEACHER</MenuItem>
          <MenuItem value='ADMIN'>ADMIN</MenuItem>
        </Select>
        <Button
          disabled={Boolean(error.email)}
          variant='contained'
          onClick={onAuth}
        >
          {isReg ? 'Sign In' : 'Login'}
        </Button>
        <Button size='small' onClick={() => setIsReg((s) => !s)}>
          {isReg ? 'Login' : 'Sign In'}
        </Button>
      </Paper>
    </>
  )
}
