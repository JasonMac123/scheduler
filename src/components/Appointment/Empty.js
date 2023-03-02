import React from "react";

export default function Empty(props) {
  const { onAdd } = props
  // onAdd triggers a state change for displays and renders the Form component
  return (
    <main className="appointment__add">
      <img
        className="appointment__add-button"
        src="images/add.png"
        alt="Add"
        onClick={onAdd}
      />
    </main>
  )
};