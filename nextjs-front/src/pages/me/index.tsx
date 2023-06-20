import { Line } from '@/components/Line'
import Nav from '@/components/Nav'
import { useUserContext } from '@/context/userContext'
import { USER_ID_ROUTE } from '@/services'
import {
  Button,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'

const Me = () => {
  const { user, setUser, getUserAuthCfg } = useUserContext()
  const [telegramAlias, setTelegramAlias] = useState('')

  const onSaveChanges = () => {
    const tgObj = { tgAlias: telegramAlias }
    axios
      .put(USER_ID_ROUTE(user.userId), tgObj, getUserAuthCfg())
      .then((res) => {
        if (res.status === 200) {
          setUser({
            ...user,
            telegramAlias: tgObj.tgAlias,
          })
          toast.success('Successfull user data update')
        }
      })
      .catch(() => toast.error('Change user data error'))
  }

  return (
    <>
      <Nav />
      <Paper
        elevation={2}
        sx={{
          maxWidth: 500,
          mx: 'auto',
          my: 3,
          p: 5,
          borderRadius: 2,
        }}
      >
        <Line>
          <TextField
            label='telegramAlias'
            value={telegramAlias}
            onChange={(e) => setTelegramAlias(e.target.value)}
          />
          <Typography>value: {user.telegramAlias || 'unknown'}</Typography>
        </Line>

        <Line>
          <Typography sx={{ width: 100 }}>fixed Role:</Typography>
          <Select sx={{ width: 225 }} value={user.role} disabled>
            <MenuItem value='STUDENT'>STUDENT</MenuItem>
            <MenuItem value='ADMIN'>ADMIN</MenuItem>
            <MenuItem value='TEACHER'>TEACHER</MenuItem>
          </Select>
        </Line>
        <Line>
          <Typography sx={{ width: 100 }}>fixed ID:</Typography>
          <TextField label='id' value={user.id} />
        </Line>
        <Line>
          <Typography sx={{ width: 100 }}>fixed Login:</Typography>
          <TextField value={user.login} />
        </Line>
        <Button onClick={onSaveChanges} variant='contained'>
          Save Changes
        </Button>
      </Paper>
    </>
  )
}

export default Me
