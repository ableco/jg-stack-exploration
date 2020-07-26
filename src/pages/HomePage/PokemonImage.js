import React from "react";
import styles from "./HomePage.module.css";
import clsx from "clsx";

function PokemonImage({
  pokemon,
  size = 96,
  grayscale = false,
  className = "",
}) {
  return (
    <img
      src={pokemon.imageUrl}
      className={clsx(className, {
        [styles.grayscale]: grayscale,
      })}
      alt={pokemon.name}
      title={pokemon.name}
      height={size}
      width={size}
    />
  );
}

export default PokemonImage;
