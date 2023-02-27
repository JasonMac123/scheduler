import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import "components/Appointment/index";

import DayList from "./DayList";
import Appointment from "components/Appointment/index";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";


export default function Application(props) {

  const [state, setState ] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState((prev) => ({...prev, days:all[0].data, appointments:all[1].data, interviewers:all[2].data}))
    })
  }, [])

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    if (interview === null) {
      appointment.interview = null;
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const data = {...appointment}

    if (appointment.interview === null) {
      return axios.delete(`/api/appointments/${id}`)
        .then(() => setState({...state, appointments}))
        .catch((e) => console.log(e))
    } 
    return axios.put(`/api/appointments/${id}`, data)
      .then(() => setState({...state, appointments}))
      .catch((e) => console.log(e))
  }

  let dailyAppointments = getAppointmentsForDay(state, state.day);

  const appointmentList = dailyAppointments.map((appointment) => {
    let interview = getInterview(state, appointment.interview);
    let interviewerArray = getInterviewersForDay(state, state.day);

    return <Appointment 
      key={appointment.id}
      {...appointment}
      interview={interview}
      interviewers={interviewerArray}
      bookInterview={bookInterview}
    />
  }) 

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentList}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}