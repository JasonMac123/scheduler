import { useReducer, useEffect } from "react";
import axios from "axios";

import {
  reducer,
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_SPOTS,
} from "reducers/application";

const useApplicationData = () => {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  // Gets all scheduler api data on launch and sets it to state
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      });
    });
  }, []);

  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    // server sends message to each client when an update to the appointments data occurs
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const appointment = {
        ...state.appointments[data.id],
        interview: data.interview ? { ...data.interview } : null,
      };

      const appointments = {
        ...state.appointments,
        [data.id]: appointment,
      };
      /* updates all clients for a state change including the client that
       * sent the api call
       */
      const result = updateSpots(state, appointment, data.id);
      dispatch({ type: SET_SPOTS, days: result, appointments });
    };

    return () => {
      if (socket.readyState === 1) {
        socket.close();
      }
    };
  }, [state]);

  function updateSpots(state, appointment, id) {
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = [...state.days].filter((item) =>
      item.appointments.includes(id)
    )[0];
    const newAppointments = Object.values(appointments);
    // filters for any appointments for targeted day that are null/empty
    const numberOfSpots = newAppointments.filter(
      (item) => days.appointments.includes(item.id) && item.interview === null
    );

    const updatedDays = [...state.days].map((item) => {
      if (item.name === days.name) {
        item.spots = numberOfSpots.length;
        return item;
      }
      return item;
    });
    // returns new array of days array with the updated amount of spots
    return updatedDays;
  }

  // books interview or updates current interview using axios put request
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const data = { ...appointment };
    return axios.put(`/api/appointments/${id}`, data).then(() => {
      const result = updateSpots(state, appointment, id);
      dispatch({ type: SET_SPOTS, days: result, appointments });
    });
  }

  // deletes the interview appointment
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.delete(`/api/appointments/${id}`).then(() => {
      const result = updateSpots(state, appointment, id);
      dispatch({ type: SET_SPOTS, days: result, appointments });
    });
  }

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
