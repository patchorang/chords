function ToggleButton({ items, selectedIndex, handleClick, className }) {
  const selectedClassNames =
    "ml-1 text-white text-sm font-bold bg-blue-500 p-2 rounded hover:bg-blue-600";

  const unselectedClassNames =
    "bg-slate-200 hover:bg-slate-300 text-sm text-gray-700 font-bold py-2 px-4 rounded ";

  return (
    <div className="flex items-center justify-center">
      <div className="inline-flex space-x-2" role="group">
        {items.map((i, index) => {
          let classesToApply = unselectedClassNames;
          if (selectedIndex === index) {
            classesToApply = selectedClassNames;
          }
          return (
            <button
              key={i}
              type="button"
              className={classesToApply}
              onClick={() => handleClick(index)}
            >
              {i}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ToggleButton;
