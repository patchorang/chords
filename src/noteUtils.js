const SHAPES = ["", "-", "aug", "dim", "⁷", "maj⁷", "-⁷", "ø⁷", "o⁷"];
const TYPES_HUMAN_SHAPES = {
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
const BASE_NOTES = ["a", "b", "c", "d", "e", "f", "g"];
const MODIFIERS = ["", "♯", "♭"];

const NOTE_LIST = [
  "A",
  "A#",
  "B",
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
];

const SHAPE_TABLE = {
  Major: [0, 4, 7],
  Minor: [0, 3, 7],
  Augmented: [0, 4, 8],
  Diminished: [0, 3, 6],
  "Dominant 7th": [0, 4, 7, 10],
  "Major 7th": [0, 4, 7, 11],
  "Minor 7th": [0, 3, 7, 10],
  "Half diminished 7th": [0, 3, 6, 10],
  "Diminished 7th": [0, 3, 6, 9],
};

const convertFlat = (flatNote) => {
  const NOTE_TABLE = {
    "A♭": "G#",
    "B♭": "A#",
    "C♭": "B",
    "D♭": "C#",
    "E♭": "D#",
    "F♭": "E",
    "G♭": "F#",
  };
  if (flatNote.includes("♭")) return NOTE_TABLE[flatNote];
  return flatNote;
};

const getRegularNote = (note) => {
  switch (note) {
    case "B#":
      return "C";
    case "E#":
      return "F";
    default:
      return note;
  }
};

const getStandardNote = (root, modifier) => {
  return getRegularNote(
    convertFlat(root.toUpperCase() + (modifier || "").replace("♯", "#"))
  );
};

const getNotesInChord = (root, modifier, shape) => {
  const notePositions = SHAPE_TABLE[shape];
  const notesInChord = [];
  let chordRoot = getRegularNote(
    convertFlat(root.toUpperCase() + (modifier || "").replace("♯", "#"))
  );
  const rootIndex = NOTE_LIST.indexOf(chordRoot);
  notePositions.forEach((index) => {
    notesInChord.push(NOTE_LIST[(index + rootIndex) % NOTE_LIST.length]);
  });
  return notesInChord;
};

const chordBeingPlayed = (root, modifier, shape, activeNotes) => {
  const notesInChord = getNotesInChord(root, modifier, shape);
  let curChord = root.toUpperCase() + (modifier || "").replace("♯", "#");
  if (curChord.includes("♭")) {
    curChord = convertFlat(curChord);
  }

  activeNotes = [...new Set(activeNotes)];
  const sameLength = activeNotes.length === notesInChord.length;
  // console.log("activeNotes", activeNotes);
  // console.log("notesInChord", notesInChord);
  // console.log("");
  return sameLength && activeNotes.every((e) => notesInChord.includes(e));
};

export {
  NOTE_LIST,
  convertFlat,
  getNotesInChord,
  chordBeingPlayed,
  getStandardNote,
  TYPES_HUMAN_SHAPES,
};
