import React from "react";
import Pokemon from "./Pokemon";
import useSWR from "swr";

function PokemonsList() {
  const {
    data: { data: pokemons },
  } = useSWR("/api/pokemons?page[number]=1&page[size]=151");

  return (
    <div className="flex flex-row flex-wrap justify-center">
      {pokemons.map((pokemon) => (
        <Pokemon key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
}

export default PokemonsList;
