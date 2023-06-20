import { Typography } from '@mui/material'
import Link from 'next/link'
import { ReactNode } from 'react'

const NavLink = ({
  href,
  active = false,
  children,
}: {
  href: string
  active?: boolean
  children: ReactNode
}) => {
  return (
    <Link href={href}>
      <Typography
        component={'h5'}
        sx={{
          textDecoration: active ? 'underline' : 'none',
        }}
      >
        {children}
      </Typography>
    </Link>
  )
}

export default NavLink
