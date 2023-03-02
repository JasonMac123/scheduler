import React, {useEffect} from "react";
import 'components/Appointment/styles.scss'
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

// list of components shown when mode is equal to component name
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "STATUS";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE"
const ERROR_DELETE = "ERROR_DELETE"

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);
  /* Changes the display for other clients using webSocket
   * otherwise state change will occur, but components on display will not change since
   * state responsible for changing display is not linked to appointment state
   */ 
  useEffect(() => {
    if (props.interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [props.interview, transition, mode]);

  // function that calls function to alter state and add data to api
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((error) => transition(ERROR_SAVE, true));
  }

  // function that deletes appointments through another function altering state
  function deleteAppointment() {
    transition(SAVING);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((error) => transition(ERROR_DELETE, true));
  }
    // different components shown when the mode of display is changed
  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && <Form onCancel={() => back()} interviewers={props.interviewers} onSave={save}/>}
      {mode === SAVING && <Status/>}
      {mode === CONFIRM && <Confirm onCancel={() => transition(SHOW)} onConfirm={deleteAppointment}/>}
      {mode === EDIT && <Form onCancel={() => back()} interviewers={props.interviewers} onSave={save} interviewer={props.interview.interviewer.id} student={props.interview.student}/> }
      {mode === ERROR_SAVE && <Error message={"Could not save appointment"} onClose={() => back()} />}
      {mode === ERROR_DELETE && <Error message={"Could not delete appointment"} onClose={() => back()} />}
    </article>
  )
}
