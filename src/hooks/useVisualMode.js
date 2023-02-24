import { useState } from "react";

const useVisualMode = (defaultTransition) => {
  const [display, setDisplay ] = useState(defaultTransition)
  const [history, setHistory] = useState([defaultTransition]);

  const transition = (value, skip = false) => {
    setDisplay(value)
    if (skip) {
      let newHistory = [...history]
      newHistory.pop()
      setHistory([...newHistory, value])
    } else {
      setHistory([...history, value])
    }
  }

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

