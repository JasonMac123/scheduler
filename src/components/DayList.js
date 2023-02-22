import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {

  const { days, value } = props 

  const dayListMap = days.map((day) => {
    return <DayListItem key={day.id} selected={day.name === value} {...day} setDay={props.onChange}/>
  })


  return(
    <ul>
      {dayListMap}
    </ul>
  )
}
