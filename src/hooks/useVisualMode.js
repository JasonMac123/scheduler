import { useState } from "react";

const useVisualMode = (defaultTransition) => {
  const [display, setDisplay] = useState(defaultTransition);
  const [history, setHistory] = useState([defaultTransition]);

  // sets display state to new page
  const transition = (value, skip = false) => {
    setDisplay(value);
    // replaces last page in history array if an error occurs
    if (skip) {
      setHistory((prev) => {
        let newHistory = [...prev];
        newHistory.pop();
        let confirmationCheck = newHistory.pop();
        if (confirmationCheck !== "CONFIRM") {
          newHistory.push(confirmationCheck);
        }
        return [...newHistory, value];
      });
    } else {
      setHistory([...history, value]);
    }
  };

  // goes back if to the last page rendered properly
  const back = () => {
    if (history.length !== 1) {
      let newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setDisplay(newHistory[newHistory.length - 1]);
    }
  };

  return { mode: display, transition, back };
};

export default useVisualMode;
