import React, { useRef, useLayoutEffect } from "react";
import Background from "components/Background";
import PokemonsList from "./PokemonsList";
import Navbar from "./Navbar";

function HomePage() {
  const navbarRef = useRef(null);
  const spacerRef = useRef(null);

  useLayoutEffect(() => {
    spacerRef.current.style.height = `${navbarRef.current.offsetHeight}px`;
  }, []);

  return (
    <Background>
      <Navbar ref={navbarRef} />
      <div ref={spacerRef} />
      <div className="p-6">
        <PokemonsList />
      </div>
    </Background>
  );
}

export default HomePage;
