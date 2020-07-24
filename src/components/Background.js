import React from "react";
import clsx from "clsx";

function Background({ className = "", ...otherProps }) {
  return (
    <div
      className={clsx("h-screen bg-indigo-800 overflow-auto", className)}
      {...otherProps}
    />
  );
}

export default Background;
