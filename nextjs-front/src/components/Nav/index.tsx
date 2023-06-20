import { useUserContext } from '@/context/userContext'
import { Box, Chip, IconButton } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useRouter } from 'next/router'
import NavLink from '@/components/Nav/NavLink'

const Nav = () => {
  const { user, exitUser } = useUserContext()
  const router = useRouter()

  return (
    <Box
      component='nav'
      sx={{
        height: 50,
        width: '100%',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        bgcolor: 'white',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
      }}
    >
      <Box sx={{ display: 'flex', gap: 5, mx: 10 }}>
        <NavLink href='/main' active={router.asPath === '/main'}>
          Main
        </NavLink>
        {user.role !== 'STUDENT' && user.role !== 'ADMIN' && (
          <NavLink href='/lessons' active={router.asPath === '/lessons'}>
            Control lessons
          </NavLink>
        )}
        {user.role === 'ADMIN' && (
          <NavLink href='/users' active={router.asPath === '/users'}>
            Users
          </NavLink>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <NavLink href='/me' active={router.asPath === '/me'}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user.login}
            <Box
              sx={{
                bgcolor: 'lightgray',
                width: 30,
                height: 30,
                borderRadius: '15px',
              }}
            ></Box>
          </Box>
        </NavLink>
        <Chip label={user.role} />
        <IconButton onClick={exitUser}>
          <LogoutIcon sx={{ color: 'lightgray' }} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default Nav
