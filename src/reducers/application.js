const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_SPOTS = "SET_SPOTS"

// switch case to update state depending on the situtation
function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return {...state, day: action.day}
    case SET_APPLICATION_DATA:
      return {...state, days: action.days, appointments: action.appointments, interviewers : action.interviewers}
    case SET_SPOTS: {
      return {...state, days: action.days, appointments: action.appointments}
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
};

module.exports = {reducer, SET_DAY, SET_APPLICATION_DATA, SET_SPOTS}