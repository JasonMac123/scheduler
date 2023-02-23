export function getAppointmentsForDay(state, day) {
  if (state.days.length === 0) {
    return [];
  }
  const targetDay = state.days.filter((info) => info.name === day);

  if (!targetDay[0]) {
    return [];
  }

  const appointmentList = targetDay[0].appointments
  const appointmentArray = Object.values(state.appointments);
  return appointmentArray.filter((interview) => appointmentList.includes(interview.id));
}