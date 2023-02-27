import { useState, useEffect } from "react";
import axios from "axios";

const useApplicationData = () => {
    const [state, setState ] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => setState({ ...state, day });

  // Gets all scheduler api data on launch and sets it to state
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState((prev) => ({...prev, days:all[0].data, appointments:all[1].data, interviewers:all[2].data}))
    })
  }, [])

  // updates the spots of the current day after new appointment
  function updateSpots(id, deletion = false) {
    const appointmentObject = {...state.appointments}
    const appointments = Object.values(appointmentObject);
    let spots;

    if (appointments[id - 1].interview === null) {
      spots = -1
    } else if (appointments[id - 1].interview !== null && deletion) {
      spots = 1
    } else {
      spots = 0
    }

    const days = [...state.days]
    for (const day of days) {
      if (day.name === state.day) {
        day.spots += spots
      }
    }
    setState(prev => {
      return {...prev, days}
      })
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
      .then(() => setState({...state, appointments}))
      .then(() => updateSpots(id, false))
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
      .then(() => setState({...state, appointments}))
      .then(() => updateSpots(id, true))
  }

  
  return {state, setDay, bookInterview, cancelInterview}
}

export default useApplicationData;