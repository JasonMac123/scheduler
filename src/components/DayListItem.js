import React from "react";
import classNames from "classnames";
import 'components/DayListItem.scss'


export default function DayListItem(props) {
  const { name, spots, setDay, selected } = props;

  const dayClass = classNames('day-list__item', {'day-list__item--selected': selected}, {'day-list__item--full': spots === 0})
  
  const formatSpots = function(spots) {
    if (spots > 1) {
      return `${spots} spots remaining`
    } else if (spots === 1) {
      return `${spots} spot remaining`
    } else {
      return `no spots remaining`
    }
  }


  return (
    <li className={dayClass}>
      <h2 className="text--regular">{name}</h2>
      <h3 onClick={() => {setDay(name)}} className="text--light">{formatSpots(spots)}</h3>
    </li>
  );
}