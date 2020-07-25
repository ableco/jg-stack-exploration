import React from "react";
import clsx from "clsx";
import Button from "components/Button";
import styles from "./HomePage.module.css";
import PokemonImage from "./PokemonImage";
import useFetchApi from "useFetchApi";
import { mutate } from "swr";

function Pokemon({ pokemon }) {
  const fetchApi = useFetchApi();

  const borderStyles =
    "border-2 border-solid border-opacity-50 border-indigo-500 rounded-md";

  const handleClick = async () => {
    await fetchApi("/api/chosen_pokemons", {
      method: "POST",
      body: {
        data: {
          type: "chosen_pokemons",
          attributes: { pokemon_id: pokemon.id },
        },
      },
    });
    mutate("/api/pokemons?page[number]=1&page[size]=151");
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
