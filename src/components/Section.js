import React from "react";
import clsx from "clsx";

function Section({ className = "", children }) {
  return (
    <div className={clsx("bg-white mx-16 p-6", className)}>{children}</div>
  );
}

export default Section;
