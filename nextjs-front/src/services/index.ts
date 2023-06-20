const BASE_URL = process.env.NEXT_PUBLIC_API_URL
export const SIGN_IN_ROUTE = `${BASE_URL}/reg`
export const LOGIN_ROUTE = `${BASE_URL}/auth/login`
export const BASE_LESSON_ROUTE = `${BASE_URL}/lesson`
export const BASE_USERS_ROUTE = `${BASE_URL}/user`
export const FILES_ID_ROUTE = (id: string) => `${BASE_URL}/file/${id}`
export const LESSON_ID_ROUTE = (id: string) => `${BASE_URL}/lesson/${id}`
export const FILES_LESSON_ID_ROUTE = (id: string) =>
  `${BASE_URL}/file/lesson/${id}`
export const USER_ID_ROUTE = (id: string) => `${BASE_URL}/user/${id}`
export const USERS_BY_LESSON_ID_ROUTE = (id: string) =>
  `${BASE_URL}/user/users/${id}`
export const ENROLL_USER_ROUTE = (userId: string, lessonId: string) =>
  `${BASE_URL}/user/${userId}/lesson/${lessonId}`
