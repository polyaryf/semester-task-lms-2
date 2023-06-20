import React, { ChangeEvent } from 'react'
import { Button, Box } from '@mui/material'
import { toast } from 'react-toastify'

const LessonUploadButton = ({
  onUpload,
}: {
  onUpload: (data: FormData) => void
}) => {
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0)
    if (!file) {
      toast.error('problem with file upload')
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    onUpload(formData)
  }

  return (
    <Box>
      <Button variant='contained' component='label'>
        Upload File
        <input type='file' onChange={handleFileUpload} hidden />
      </Button>
    </Box>
  )
}

export default LessonUploadButton
