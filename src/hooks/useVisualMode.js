import { useState } from "react";

const useVisualMode = (defaultTransition) => {
  const [display, setDisplay ] = useState(defaultTransition)
  const [history, setHistory] = useState([defaultTransition]);

  // sets display state to new page
  const transition = (value, skip = false) => {
    setDisplay(value)
    // replaces last page in history array if an error occurs
    if (skip) {
      let newHistory = [...history]
      newHistory.pop()
      setHistory([...newHistory, value])
    } else {
      setHistory([...history, value])
    }
  }

  // goes back if to the last page rendered properly
  const back = () => {
    if (history.length !== 1) {
      let newHistory = [...history]
      newHistory.pop()
      setHistory(newHistory)
      setDisplay(newHistory[newHistory.length - 1])
    }
  }

  return {mode: display, transition, back}
}

export default useVisualMode;

