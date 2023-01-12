function Slider({ currentInterval, onChangeSpeed }) {
  return (
    <div className="flex space-x-4 items-center pt-1">
      <label
        htmlFor="default-range"
        className="inline text-sm font-medium text-gray-600 dark:text-white"
      >
        Speed - {currentInterval / 1000}
      </label>
      <input
        id="default-range"
        type="range"
        min="500"
        max="10000"
        value={currentInterval}
        onChange={onChangeSpeed}
        className="inline w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}

export default Slider;
