import { useReducer, useEffect } from "react";
import axios from "axios";

const useApplicationData = () => {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const SET_SPOTS = "SET_SPOTS"

  // switch case to update state depending on the situtation
  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {...state, day: action.day}
      case SET_APPLICATION_DATA:
        return {...state, days: action.days, appointments: action.appointments, interviewers : action.interviewers}
      case SET_INTERVIEW: {
        return {...state, appointments: action.appointments}
      }
      case SET_SPOTS: {
        return {...state, days: action.days, appointments: action.appointments}
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

  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const appointment = {
        ...state.appointments[data.id],
        interview: data.interview ? {...data.interview} : null
      };
      const appointments = {
        ...state.appointments,
        [data.id]: appointment
      };
    
      // gets a preview of the updated state without directly changing it
      // to check how many spots are remaining
      const action = {type: SET_INTERVIEW, appointments}
      const nextStage = reducer(state, action);

      const days = nextStage.days.filter(item => item.appointments.includes(data.id))[0]
      const newAppointments = Object.values(nextStage.appointments)
      const numberOfSpots = newAppointments.filter((item) => days.appointments.includes(item.id) && item.interview !== null)

      const updatedDays = [...state.days].map((item) => {
        if (item.name === days.name) {
          item.spots = 5 - numberOfSpots.length
          return item;
        }
        return item;
      })

      dispatch({type: SET_SPOTS, days: updatedDays, appointments})
    }

    return () => {
      if (socket.readyState === 1) {
        socket.close()
      }
    }
  }, [state])

  // books interview or updates current interview using axios put request
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
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
  }

  // deletes the interview appointment
  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
  }

  return {state, setDay, bookInterview, cancelInterview}
}

export default useApplicationData;