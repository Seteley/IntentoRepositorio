import React from "react";

const Keypad = ({ onKeyPress }) => {
  const buttons = [
    "7", "8", "9",
    "4", "5", "6",
    "1", "2", "3",
    "clear", "0", "submit"
  ];

  return (
    <div className="keypad">
      {buttons.map((button) => (
        <button
          key={button}
          onClick={() => onKeyPress(button)}
          className={button === "submit" ? "submit" : button === "clear" ? "clear" : ""}
        >
          {button === "clear" ? "⟲" : button === "submit" ? "✓" : button}
        </button>
      ))}
    </div>
  );
};

export default Keypad;
