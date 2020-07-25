import React from "react";
import clsx from "clsx";
import Button from "components/Button";
import styles from "./HomePage.module.css";
import PokemonImage from "./PokemonImage";
import useFetchApi from "useFetchApi";
import { mutate } from "swr";

function Pokemon({ pokemon, chosenPokemon }) {
  const fetchApi = useFetchApi();

  const borderStyles =
    "border-2 border-solid border-opacity-50 border-indigo-500 rounded-md";

  const choosePokemon = async () => {
    await fetchApi("/api/chosen_pokemons", {
      method: "POST",
      body: {
        data: {
          type: "chosen_pokemons",
          attributes: { pokemon_id: pokemon.id },
        },
      },
    });
    mutate("/api/chosen_pokemons?include=pokemon");
  };

  const removePokemon = async () => {
    await fetchApi(`/api/chosen_pokemons/${chosenPokemon.id}`, {
      method: "DELETE",
    });
    mutate("/api/chosen_pokemons?include=pokemon");
  };

  return (
    <div
      className={clsx(`${borderStyles} m-2 overflow-hidden`, styles.pokemon)}
    >
      <PokemonImage
        pokemon={pokemon}
        grayscale={!chosenPokemon}
        className={styles.listedPokemonImage}
      />
      <Button
        variant="barebones"
        className={clsx("w-full", {
          "bg-blue-600 hover:bg-blue-700": !chosenPokemon,
          "bg-red-800 hover:bg-red-900": chosenPokemon,
        })}
        onClick={chosenPokemon ? removePokemon : choosePokemon}
      >
        {chosenPokemon ? "Remove" : "Choose!"}
      </Button>
    </div>
  );
}

export default Pokemon;
