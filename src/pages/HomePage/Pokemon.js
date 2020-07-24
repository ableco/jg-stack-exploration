import React, { useContext } from "react";
import clsx from "clsx";
import Button from "components/Button";
import AuthContext from "AuthContext";
import styles from "./HomePage.module.css";
import PokemonImage from "./PokemonImage";

function Pokemon({ pokemon }) {
  const { currentAuthToken } = useContext(AuthContext);

  const borderStyles =
    "border-2 border-solid border-opacity-50 border-indigo-500 rounded-md";

  const handleClick = async () => {
    await fetch("/api/chosen_pokemons", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer token=${currentAuthToken}`,
      },
      body: JSON.stringify({
        data: {
          type: "chosen_pokemons",
          attributes: { pokemon_id: pokemon.id },
        },
      }),
    });
  };

  return (
    <div
      className={clsx(`${borderStyles} m-2 overflow-hidden`, styles.pokemon)}
    >
      <PokemonImage
        pokemon={pokemon}
        grayscale
        className={styles.listedPokemonImage}
      />
      <Button
        variant="barebones"
        className="w-full bg-blue-600 hover:bg-blue-700"
        onClick={handleClick}
      >
        Choose!
      </Button>
    </div>
  );
}

export default Pokemon;
