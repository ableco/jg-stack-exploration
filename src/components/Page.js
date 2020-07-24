import React from "react";
import clsx from "clsx";

function Page({ className = "", children }) {
  return (
    <div className={clsx("bg-white h-screen mx-16 p-6", className)}>
      {children}
    </div>
  );
}

export default Page;
