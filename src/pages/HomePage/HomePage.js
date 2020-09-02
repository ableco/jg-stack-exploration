import React from "react";
import Background from "components/Background";
import Navbar from "./Navbar";

function HomePage() {
  return (
    <Background>
      <Navbar />
      <div style={{ height: "72px" }} />
      <div className="p-6"></div>
    </Background>
  );
}

export default HomePage;
