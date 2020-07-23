import React from "react";
import { render } from "react-dom";
import App from "components/App";
import "stylesheets/application.scss";

document.addEventListener("DOMContentLoaded", () => {
  render(<App />, document.getElementById("root"));
});
