import React from "react";
import classNames from "classnames";

import "components/Button.scss";

export default function Button(props) {
  const { children, confirm, danger, onClick, disabled } = props

   const classes = classNames('button ', {'button--danger': danger}, {'button--confirm': confirm})

  return <button onClick={onClick} className={classes} disabled={disabled}>{children}</button>;
};
