import React from "react";
import clsx from "clsx";

const variantClasses = {
  primary:
    "rounded-md text-white bg-yellow-700 hover:bg-yellow-800 focus:bg-yellow-800",
  secondary:
    "rounded-md text-white bg-red-800 hover:bg-red-900 focus:bg-red-900",
  barebones: "text-white",
};

function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...otherProps
}) {
  return (
    <button
      className={clsx(
        "p-2 focus:outline-none text-center",
        variantClasses[variant] || "",
        className
      )}
      type={type}
      {...otherProps}
    />
  );
}

export default Button;
