import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import 'components/InterviewerList.scss'

export default function InterviewerList(props) {
  const { interviewers, setInterviewer, interviewer } = props

  const interviewerPeople = interviewers.map((person) => {
    return <InterviewerListItem key={person.id} selected={interviewer === person.id} {...person} setInterviewer={setInterviewer}/>
  })

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewerPeople}
      </ul>
    </section>  
  )
}