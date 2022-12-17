function Slider({ currentInterval, onChangeSpeed }) {
  return (
    <div>
      <label
        htmlFor="default-range"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Speed
      </label>
      <input
        id="default-range"
        type="range"
        min="500"
        max="10000"
        value={currentInterval}
        onChange={onChangeSpeed}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
    </div>
  );
}

export default Slider;
