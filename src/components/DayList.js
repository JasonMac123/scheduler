import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {

  const { days, setDay } = props 

  const dayListMap = days.map((day) => {
    return <DayListItem key={day.id} selected={day.name === props.day} {...day} setDay={() => setDay(day.name)}/>
  })


  return(
    <ul>
      {dayListMap}
    </ul>
  )
}
