import { Modal, Typography } from '@mui/material'
import React from 'react'

export const AppointmentModal = ({
  open,
  onClose,
  appointment = {},
  setAppointment,
  loading,
}) => {
  const isChangeStatus = !!appointment?._id;
  return (
    <Modal open={open} onClose={onClose}>
      <Typography>{isChangeStatus ? "Cambiar Estado" : "Crear Cita"}</Typography>
    </Modal>
  )
}
