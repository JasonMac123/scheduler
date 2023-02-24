export function getAppointmentsForDay(state, day) {
  if (state.days.length === 0) {
    return [];
  }
  const targetDay = state.days.filter((info) => info.name === day);

  if (!targetDay[0]) {
    return [];
  }

  const appointmentList = targetDay[0].appointments;
  const appointmentArray = Object.values(state.appointments);

  return appointmentArray.filter((interview) => appointmentList.includes(interview.id));
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  let obj = {student:interview.student};

  const interviewerID = interview.interviewer;
  obj.interviewer = state.interviewers[interviewerID];

  return obj;
}

export function getInterviewersForDay(state, day) {
    if (state.days.length === 0) {
    return [];
  }
  const targetDay = state.days.filter((info) => info.name === day);

  if (!targetDay[0]) {
    return [];
  }

  const interviewerList = targetDay[0].interviewers;
  const interviewerArray = Object.values(state.interviewers);
  
  return interviewerArray.filter((interviewer) => interviewerList.includes(interviewer.id));
}