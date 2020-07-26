import React from "react";
import clsx from "clsx";
import Button from "components/Button";
import styles from "./HomePage.module.css";
import PokemonImage from "./PokemonImage";
import { mutate } from "swr";
import useGraphqlClient, { gql } from "lib/useGraphqlClient";
import { CHOSEN_POKEMONS_QUERY } from "./Navbar";
import { LIST_POKEMONS_QUERY } from "./PokemonsList";

const ADD_POKEMON_MUTATION = gql`
  mutation($pokemonId: ID!) {
    addPokemon(input: { pokemonId: $pokemonId }) {
      success
    }
  }
`;

const REMOVE_POKEMON_MUTATION = gql`
  mutation($pokemonId: ID!) {
    removePokemon(input: { pokemonId: $pokemonId }) {
      success
    }
  }
`;

function Pokemon({ pokemon }) {
  const graphqlClient = useGraphqlClient();

  const borderStyles =
    "border-2 border-solid border-opacity-50 border-indigo-500 rounded-md";

  const choosePokemon = async () => {
    await graphqlClient.request(ADD_POKEMON_MUTATION, {
      pokemonId: pokemon.id,
    });
    mutate(LIST_POKEMONS_QUERY);
    mutate(CHOSEN_POKEMONS_QUERY);
  };

  const removePokemon = async () => {
    await graphqlClient.request(REMOVE_POKEMON_MUTATION, {
      pokemonId: pokemon.id,
    });
    mutate(LIST_POKEMONS_QUERY);
    mutate(CHOSEN_POKEMONS_QUERY);
  };

  return (
    <div
      className={clsx(`${borderStyles} m-2 overflow-hidden`, styles.pokemon)}
    >
      <PokemonImage
        pokemon={pokemon}
        grayscale={!pokemon.chosen}
        className={styles.listedPokemonImage}
      />
      <Button
        variant="barebones"
        className={clsx("w-full", {
          "bg-blue-600 hover:bg-blue-700": !pokemon.chosen,
          "bg-red-800 hover:bg-red-900": pokemon.chosen,
        })}
        onClick={pokemon.chosen ? removePokemon : choosePokemon}
      >
        {pokemon.chosen ? "Remove" : "Choose!"}
      </Button>
    </div>
  );
}

export default Pokemon;
