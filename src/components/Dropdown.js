import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";

let uniqueId = 0;

const generateUniqueId = () => {
  const currentUniqueId = `uniqueId-${uniqueId}`;
  uniqueId++;
  return currentUniqueId;
};

function Dropdown({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const uniqueId = useMemo(generateUniqueId, []);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOutsideClick = useCallback(
    (event) => {
      const closestDropdown = event.target.closest(`#${uniqueId}`);
      if (!closestDropdown) {
        setIsOpen(false);
      }
    },
    [uniqueId, setIsOpen]
  );

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  });

  return (
    <div className="relative" ref={dropdownRef} id={uniqueId}>
      <span className="p-4 cursor-pointer" onClick={handleClick}>
        {title}
      </span>
      {isOpen ? (
        <div className="bg-white border p-4 absolute">{children}</div>
      ) : null}
    </div>
  );
}

export default Dropdown;
