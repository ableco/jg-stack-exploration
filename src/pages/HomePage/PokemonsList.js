import React from "react";
import Pokemon from "./Pokemon";
import useSWR from "swr";

function PokemonsList() {
  const {
    data: { data: pokemons },
  } = useSWR("/api/pokemons?page[number]=1&page[size]=151");
  const {
    data: { data: chosenPokemonItems },
  } = useSWR("/api/chosen_pokemons?include=pokemon");

  return (
    <div className="flex flex-row flex-wrap justify-center">
      {pokemons.map((pokemon) => (
        <Pokemon
          key={pokemon.id}
          pokemon={pokemon}
          chosenPokemon={chosenPokemonItems.find((chosenPokemon) => {
            return (
              chosenPokemon.attributes.pokemon_id.toString() === pokemon.id
            );
          })}
        />
      ))}
    </div>
  );
}

export default PokemonsList;
