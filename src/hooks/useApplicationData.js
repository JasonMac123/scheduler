import { useReducer, useEffect } from "react";
import axios from "axios";

const useApplicationData = () => {
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

      const result = updateSpots(state, appointment, data.id)
      dispatch({type: SET_SPOTS, days: result, appointments})
    }

    return () => {
      if (socket.readyState === 1) {
        socket.close()
      }
    }
  }, [state])

  function updateSpots(state, appointment, id) {
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = [...state.days].filter(item => item.appointments.includes(id))[0]
    const newAppointments = Object.values(appointments)
    const numberOfSpots = newAppointments.filter((item) => days.appointments.includes(item.id) && item.interview !== null)

    const updatedDays = [...state.days].map((item) => {
      if (item.name === days.name) {
        item.spots = 5 - numberOfSpots.length
        return item;
      }
      return item;
    })

    return updatedDays
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

    const data = {...appointment}
    return axios.put(`/api/appointments/${id}`, data)
      .then(() => {
        const result = updateSpots(state, appointment, id)
        dispatch({type: SET_SPOTS, days: result, appointments})
      })
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
      .then(() => {
        const result = updateSpots(state, appointment, id)
        dispatch({type: SET_SPOTS, days: result, appointments})
      })
  }

  return {state, setDay, bookInterview, cancelInterview}
}

export default useApplicationData;