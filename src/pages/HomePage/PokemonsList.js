import React from "react";
import Pokemon from "./Pokemon";
import useSWR from "swr";
import { gql } from "lib/useGraphqlClient";

const LIST_POKEMONS_QUERY = gql`
  {
    pokemons {
      id
      name
      imageUrl
      number
      chosen
    }
  }
`;

function PokemonsList() {
  const {
    data: { pokemons },
  } = useSWR(LIST_POKEMONS_QUERY);

  return (
    <div className="flex flex-row flex-wrap justify-center">
      {pokemons.map((pokemon) => (
        <Pokemon key={pokemon.id} pokemon={pokemon} chosenPokemon={null} />
      ))}
    </div>
  );
}

export default PokemonsList;
export { LIST_POKEMONS_QUERY };
