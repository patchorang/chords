function MidiStatus({ midiInput, error }) {
  const isError = !midiInput;
  const renderedText = !isError ? "" : error;

  const defaultClassNames = "inline text-sm font-medium text-gray-600";
  const errorClassNames = "inline text-sm font-medium text-red-500";
  const classNames = isError ? errorClassNames : defaultClassNames;

  return (
    <span>
      <label htmlFor="default-range" className={classNames}>
        {renderedText}
      </label>
    </span>
  );
}

export default MidiStatus;
