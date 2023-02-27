import React from "react";
import 'components/Appointment/styles.scss'
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import useVisualMode from "hooks/useVisualMode";


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE"
const SAVING = "STATUS"
const CONFIRM = "CONFIRM"

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
  }

  function deleteAppointment() {
    transition(SAVING);
    props.bookInterview(props.id, null)
      .then(() => transition(EMPTY))
  }

  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === CREATE && <Form onCancel={() => back()} interviewers={props.interviewers} onSave={save}/>}
      {mode === SAVING && <Status/>}
      {mode === CONFIRM && <Confirm onCancel={() => transition(SHOW)} onConfirm={deleteAppointment}/>}
    </article>
  )
}
