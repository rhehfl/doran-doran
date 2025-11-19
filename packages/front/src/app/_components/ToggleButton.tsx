import { useState } from "react";
interface ToggleButtonProps {
  defaultChecked: boolean;
  onTurnOn?: () => void;
  onTurnOff?: () => void;
}
export default function ToggleButton({
  defaultChecked,
  onTurnOn,
  onTurnOff,
}: ToggleButtonProps) {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newChecked = !isChecked;

    if (newChecked) {
      if (onTurnOn) {
        onTurnOn();
      }
    } else {
      if (onTurnOff) {
        onTurnOff();
      }
    }

    setIsChecked(newChecked);
  };

  const trackClasses = `
    flex items-center w-12 h-6 rounded-full p-0.5 transition-colors duration-300
    cursor-pointer focus:outline-none 
    ${isChecked ? "bg-green-500" : "bg-gray-300"}
  `;

  const handleClasses = `
    w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300
    ${isChecked ? "translate-x-6" : "translate-x-0"}
  `;

  return (
    <button
      onClick={handleToggle}
      role="switch"
      aria-checked={isChecked}
      className={trackClasses}
    >
      <span className={handleClasses}></span>
    </button>
  );
}
