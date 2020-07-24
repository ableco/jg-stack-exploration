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
      src={pokemon.attributes.image_url}
      className={clsx(className, {
        [styles.grayscale]: grayscale,
      })}
      alt={pokemon.attributes.name}
      title={pokemon.attributes.name}
      height={size}
      width={size}
    />
  );
}

export default PokemonImage;
