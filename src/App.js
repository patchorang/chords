import { useState, useEffect } from "react";
import Toggle from "./components/Toggle";
import Slider from "./components/Slider";

const TYPES = ["", "-", "aug", "dim", "⁷", "maj⁷", "-⁷", "ø⁷", "o⁷"];
const TYPES_HUMAN_READABLE = {
  "": "Major",
  "-": "Minor",
  aug: "Augmented",
  dim: "Diminished",
  "⁷": "Dominant 7th",
  "maj⁷": "Major 7th",
  "-⁷": "Minor 7th",
  "ø⁷": "Half diminished 7th",
  "o⁷": "Diminished 7th",
};
const NOTES = ["a", "b", "c", "d", "e", "f", "g"];
const MODIFIERS = ["", "♯", "♭"];

function App() {
  const randomElementFrom = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const [currentTypes, setCurrentTypes] = useState(
    TYPES.reduce((acc, curr) => ((acc[curr] = true), acc), {})
  );

  const [type, setType] = useState(randomElementFrom(TYPES));
  const [note, setNote] = useState(randomElementFrom(NOTES));
  const [modifier, setModifier] = useState(randomElementFrom(MODIFIERS));
  const [intervalTime, setIntervalTime] = useState(2000);
  const [autoChange, setAutoChange] = useState(true);

  useEffect(() => {
    if (autoChange) {
      const interval = setInterval(() => {
        generateNote();
      }, intervalTime);
      return () => clearInterval(interval);
    }
  }, [intervalTime, autoChange, currentTypes]);

  const generateNote = () => {
    const keys = Object.keys(currentTypes);
    const filteredTypes = keys.filter((key) => {
      return currentTypes[key];
    });
    setNote(randomElementFrom(NOTES));
    setType(randomElementFrom(filteredTypes));
    setModifier(randomElementFrom(MODIFIERS));
  };

  const setIntervalSpeed = (speed) => {
    setIntervalTime(speed);
  };

  return (
    <div className="container m-auto grid max-w-2xl w-full">
      <div className="bg-slate-50 p-8 my-4 rounded-md">
        <div className="container w-full pb-8">
          <span className="text-5xl mb-4">
            {note}
            {modifier} {type}
          </span>
          <Toggle
            className="float-right mt-4"
            handleToggle={() => setAutoChange(!autoChange)}
            isOn={autoChange}
          >
            Use timer
          </Toggle>
        </div>

        {autoChange ? (
          <Slider
            currentInterval={intervalTime}
            onChangeSpeed={(event) => setIntervalSpeed(event.target.value)}
          ></Slider>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={generateNote}
          >
            Next chord
          </button>
        )}

        <div className="pt-8">
          <div className="container m-auto grid grid-cols-2 pt-2">
            {TYPES.map((type) => {
              return (
                <Toggle
                  key={type}
                  isOn={currentTypes[type]}
                  handleToggle={() => {
                    setCurrentTypes({
                      ...currentTypes,
                      [type]: !currentTypes[type],
                    });
                  }}
                >
                  {TYPES_HUMAN_READABLE[type]}
                </Toggle>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
