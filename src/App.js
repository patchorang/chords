import { useState, useEffect, useRef, useCallback } from "react";
import { BiRefresh } from "react-icons/bi";
import {
  chordBeingPlayed,
  getNotesInChord,
  TYPES_HUMAN_SHAPES,
} from "./noteUtils";
import { WebMidi } from "webmidi";
import Toggle from "./components/Toggle";
import Slider from "./components/Slider";
import MidiStatus from "./components/MidiStatus";
import PianoViewer from "./components/PianoViewer";
import ToggleButton from "./components/ToggleButton";
import useEventListener from "./useEventListener";

const SHAPES = ["", "-", "aug", "dim", "⁷", "maj⁷", "-⁷", "ø⁷", "o⁷"];
const MIDI = 0;
const TIMER = 1;
const BASIC = 2;
const MODES = ["Midi", "Timer", "Basic"];
const SHAPES_HUMAN_READABLE = {
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
    SHAPES.reduce((acc, curr) => ((acc[curr] = true), acc), {})
  );
  const [shape, setShape] = useState(randomElementFrom(SHAPES));
  const [note, setNote] = useState(randomElementFrom(NOTES));
  const [modifier, setModifier] = useState(randomElementFrom(MODIFIERS));
  const [intervalTime, setIntervalTime] = useState(2000);
  const [midiDeviceIndex, setMidiDeviceIndex] = useState(0);
  const [activeMIDINotes, setActiveMIDINotes] = useState([]);
  const [midiInput, setMidiInput] = useState(0);
  const [midiError, setMidiError] = useState(
    "No MIDI devices found, check your connection."
  );
  const [firstTimeSetup, setFirstTimeSetup] = useState(true);
  const [mode, setMode] = useState(0);
  const [loadingDevices, setLoadingDevices] = useState(false);
  let nextActiveMIDINotes = activeMIDINotes;

  const setAndWaitLoadingDevicesFalse = () => {
    setTimeout(() => {
      setLoadingDevices(false);
    }, 632);
  };

  function onEnabled() {
    if (WebMidi.inputs.length < 1) {
      if (firstTimeSetup) setMode(1);
      setFirstTimeSetup(false);
      setMidiInput(0);
    } else {
      setMidiInput(WebMidi.inputs[midiDeviceIndex]);
    }
    setAndWaitLoadingDevicesFalse();
  }

  // TODO understand useCallback
  const handleNotePlayed = useCallback((e) => {
    const note = e.note.name + (e.note.accidental || "");
    if (!activeMIDINotes.includes(note)) {
      setActiveMIDINotes((prevMidiNotes) => [...prevMidiNotes, note]);
    }
  });

  const handleNoteUnplayed = useCallback((e) => {
    const note = e.note.name + (e.note.accidental || "");
    if (activeMIDINotes.includes(note)) {
      setActiveMIDINotes((prevMidiNotes) =>
        prevMidiNotes.filter((n) => n !== note)
      );
    }
  });

  useEventListener("noteon", handleNotePlayed, midiInput);
  useEventListener("noteoff", handleNoteUnplayed, midiInput);

  const tryToSetupMidiDevices = () => {
    setLoadingDevices(true);
    if (navigator.requestMIDIAccess) {
      WebMidi.enable()
        .then(onEnabled)
        .catch((err) => {
          setMidiError("Not connect to a MIDI device");
          setAndWaitLoadingDevicesFalse();
        });
    } else {
      setMidiError(
        "MIDI is not supported in this browser, use Chrome to play with MIDI."
      );
      setAndWaitLoadingDevicesFalse();
    }
  };

  // Initial setup
  useEffect(() => {
    tryToSetupMidiDevices();
  }, [midiDeviceIndex]);

  // Timer changes
  useEffect(() => {
    if (mode === TIMER) {
      const interval = setInterval(() => {
        generateNote();
      }, intervalTime);
      return () => clearInterval(interval);
    }
  }, [intervalTime, mode, currentTypes]);

  useEffect(() => {
    if (
      chordBeingPlayed(
        note,
        modifier,
        SHAPES_HUMAN_READABLE[shape],
        activeMIDINotes
      )
    ) {
      generateNote();
    }
  }, [activeMIDINotes, note, modifier, shape]);

  const generateNote = () => {
    const keys = Object.keys(currentTypes);
    const filteredTypes = keys.filter((key) => {
      return currentTypes[key];
    });
    setNote(randomElementFrom(NOTES));
    setShape(randomElementFrom(filteredTypes));
    setModifier(randomElementFrom(MODIFIERS));
  };

  const setIntervalSpeed = (speed) => {
    setIntervalTime(speed);
  };

  const renderedMidiSelector = (
    <select
      className="border rounded mt-1 text-sm font-medium text-gray-600 p-1"
      value={midiDeviceIndex}
      onChange={(e) => setMidiDeviceIndex(e.target.value)}
    >
      {WebMidi.inputs.map((i, index) => {
        return (
          <option key={index} value={index}>
            {i.name}
          </option>
        );
      })}
    </select>
  );

  const renderedLoadingDevicesButton = (
    <BiRefresh
      className={`ml-2 inline text-gray-600 ${
        loadingDevices ? "animate-spin" : ""
      }`}
      size={24}
      onClick={tryToSetupMidiDevices}
    />
  );

  const renderedMidiOptions = mode === MIDI && (
    <div className="mt-2">
      <MidiStatus midiInput={midiInput} error={midiError} />
      {midiInput ? renderedMidiSelector : ""}
      {renderedLoadingDevicesButton}
    </div>
  );

  let renderedControls;
  switch (mode) {
    case TIMER:
      renderedControls = (
        <Slider
          currentInterval={intervalTime}
          onChangeSpeed={(event) => setIntervalSpeed(event.target.value)}
        ></Slider>
      );
      break;
    case MIDI:
      renderedControls = (
        <>
          <div className="inline text-sm font-medium text-gray-600">
            Play the chord on your keyboard or
          </div>
          <button
            className="inline ml-1 text-white text-sm font-bold bg-blue-500 p-2 rounded hover:bg-blue-600"
            onClick={generateNote}
          >
            Show next chord
          </button>
        </>
      );
      break;
    case BASIC:
      renderedControls = (
        <button
          className="inline ml-1 text-white text-sm font-bold bg-blue-500 p-2 rounded hover:bg-blue-600"
          onClick={generateNote}
        >
          Show next chord
        </button>
      );
      break;
  }

  const notesInChord = getNotesInChord(
    note,
    modifier,
    TYPES_HUMAN_SHAPES[shape]
  );

  const handleChangeMode = (index) => {
    setMode(index);
  };

  return (
    <div className="container m-auto grid max-w-2xl w-full">
      <div className="bg-slate-50 p-8 my-4 rounded-md">
        <div className="container w-full pb-2">
          <div className="flex justify-between mb-2 items-center">
            <span className="text-5xl font-bold">
              {note}
              {modifier} {shape}
            </span>
            <div className="flex flex-col items-end">
              <ToggleButton
                items={MODES}
                selectedIndex={mode}
                handleClick={handleChangeMode}
              />
              <div>{renderedMidiOptions}</div>
            </div>
          </div>
        </div>

        <PianoViewer className="mt-4" keys={notesInChord} />
        <div className="mt-8 mb-4">{renderedControls}</div>

        <div className="pt-6">
          <div className="container m-auto grid grid-cols-2">
            {SHAPES.map((type) => {
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
                  {SHAPES_HUMAN_READABLE[type]}
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
