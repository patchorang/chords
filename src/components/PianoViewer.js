import { getStandardNote } from "../noteUtils";
import "../piano.css";

function PianoViewer({ keys, className }) {
  const pianoKeysToDisplay = [
    "f",
    "f#",
    "g",
    "g#",
    "a",
    "a#",
    "b",
    "c",
    "c#",
    "d",
    "d#",
    "e",
    "f",
    "f#",
    "g",
    "g#",
    "a",
    "a#",
    "b",
    "c",
    "c#",
    "d",
    "d#",
    "e",
  ];

  const renderedKeys = [];

  let currentKeyIndex = 0;
  for (var i = 0; i < pianoKeysToDisplay.length; i++) {
    let isActive = false;
    if (keys && currentKeyIndex < keys.length) {
      const currentKey = getStandardNote(keys[currentKeyIndex]);
      if (pianoKeysToDisplay[i].toUpperCase() === currentKey) {
        isActive = true;
        currentKeyIndex++;
      }
    }

    const isSharp = pianoKeysToDisplay[i].includes("#");
    const root =
      pianoKeysToDisplay[i].substring(0, 1).toUpperCase() +
      (isSharp ? "s" : "");
    const color = isSharp ? "black " : "white ";
    const active = isActive ? " pressed" : "";
    const classNames = color + root + active;
    renderedKeys.push(<li key={i} className={classNames}></li>);
  }

  return <ul className={`set ${className}`}>{renderedKeys}</ul>;
}

export default PianoViewer;
