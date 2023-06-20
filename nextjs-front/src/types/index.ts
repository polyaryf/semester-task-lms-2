export type RoleType = 'TEACHER' | 'STUDENT' | 'ADMIN'

export type LessonType = {
  id: number
  name: string
  description: string
  start: string
  creatorId: number
}

export type UserType = {
  token: string
  role: string
  userId: string
  id: string
  login: string
  name: string
  telegramAlias: string
}

export type LessonStudentType = {
  createdDate: string
  email: string
  firstName: string
  id: number
  lastName: string
  profilePhoto: string
  redisId: string
  role: string
  since: string
  state: string
  tgAlias: string
  updateDate: string
}

export type FileType = {
  file: null
  format: string
  id: number
  name: string
  state: string
}
