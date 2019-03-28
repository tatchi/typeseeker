import React, { Component } from "react";

const words = [
  "revolver",
  "javascript",
  "hello",
  "bonjour",
  "salut",
  "coco",
  "poisson"
];

const getRandomWord = words => words[Math.floor(Math.random() * words.length)];

const initialState = {
  timeLeft: 3,
  inputValue: "",
  infoText: "",
  score: 0,
  word: getRandomWord(words)
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SetInputValue":
      return { ...state, inputValue: action.payload, infoText: "" };
    case "DecrementTimeLeft":
      return { ...state, timeLeft: state.timeLeft - 1 };
    case "Reset":
      return initialState;
    case "IncrementScore":
      return { ...state, score: state.score + 1 };
    case "GameOver":
      return { ...state, infoText: "Game Over!" };
    case "FoundWord":
      return {
        ...state,
        inputValue: "",
        infoText: "Correct!",
        timeLeft: 3,
        word: getRandomWord(words)
      };
    default:
      throw new Error("unhandled action");
  }
};

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  // const [timeLeft, setTimeLeft] = React.useState(3);
  // const [inputValue, setInputValue] = React.useState("");
  // const [score, setScore] = React.useState(0);
  // const [word, setWord] = React.useState(() => getRandomWord(words));
  const savedCallback = React.useRef();

  const handleOnChangeInput = e => {
    dispatch({ type: "SetInputValue", payload: e.target.value });
    if (e.target.value === state.word) {
      dispatch({ type: "FoundWord" });
      if (state.timeLeft === 0) {
        dispatch({ type: "Reset" });
      } else {
        dispatch({ type: "IncrementScore" });
      }
    }
  };

  React.useEffect(() => {
    if (state.timeLeft === 0) {
      dispatch({ type: "GameOver" });
    }
  }, [state.timeLeft]);

  React.useEffect(() => {
    // can read fresh state and props
    if (state.timeLeft > 0) {
      savedCallback.current = () => dispatch({ type: "DecrementTimeLeft" });
    } else {
      savedCallback.current = () => {};
    }
  });

  React.useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, 1000);
    return () => clearInterval(id);
  }, [state.word]);
  return (
    <div>
      <div>{state.word}</div>
      <input
        type="text"
        value={state.inputValue}
        onChange={handleOnChangeInput}
      />
      <div>
        time left: {state.timeLeft} - score: {state.score}
      </div>
      <div>{state.infoText}</div>
    </div>
  );
};

export default App;
