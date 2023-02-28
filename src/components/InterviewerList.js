import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import PropTypes from 'prop-types'; 
import 'components/InterviewerList.scss'

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

export default function InterviewerList(props) {
  const { interviewers, onChange, value } = props

  const interviewerPeople = interviewers.map((person) => {
    return <InterviewerListItem key={person.id} selected={value === person.id} {...person} setInterviewer={() => onChange(person.id)}/>
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