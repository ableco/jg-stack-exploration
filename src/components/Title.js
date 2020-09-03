import React from "react";
import clsx from "clsx";

function Title({ className = "", children, ...otherProps }) {
  return (
    <h1 className={clsx("text-2xl", className)} {...otherProps}>
      {children}
    </h1>
  );
}

export default Title;
