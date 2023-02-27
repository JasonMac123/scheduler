import { useReducer, useEffect } from "react";
import axios from "axios";

const useApplicationData = () => {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  // switch case to update state depending on the situtation
  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {...state, day: action.day}
      case SET_APPLICATION_DATA:
        return {...state, days: action.days, appointments: action.appointments, interviewers : action.interviewers}
      case SET_INTERVIEW: {
        return {...state, appointments: action.appointments, days: action.days}
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({type: SET_DAY, day});

  // Gets all scheduler api data on launch and sets it to state
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      dispatch({type: SET_APPLICATION_DATA, days:all[0].data, appointments:all[1].data, interviewers:all[2].data})
    })
  }, [])

  // updates the spots of the current day after new appointment
  function updateSpots(id, deletion, appointments) {
    const appointmentObject = {...state.appointments}
    let spots;

    if (appointmentObject[id].interview === null) {
      spots = -1
    } else if (appointmentObject[id].interview !== null && deletion) {
      spots = 1
    } else {
      spots = 0
    }

    const days = [...state.days].map((item) => {
      if (item.name === state.day) {
        item.spots += spots;
      }
      return item
    })
    dispatch({type: SET_INTERVIEW, days, appointments})
  }

  // books interview or updates current interview using axios put request
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    /* rejects if interviewer is null as the server request will go through
     * even though the data is bad therefore if statement manually checks if
     * a interviewer has been selected
     */
    if (appointment.interview.interviewer === null) {
      return Promise.reject("interview cannot be empty")
    }

    const data = {...appointment}
    return axios.put(`/api/appointments/${id}`, data)
      .then(() => updateSpots(id, false, appointments))
  }

  // deletes the interview appointment
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
      .then(() => updateSpots(id, true, appointments))
  }

  
  return {state, setDay, bookInterview, cancelInterview}
}

export default useApplicationData;