import React, { useContext, useEffect, useState, useCallback } from "react";
import AuthContext from "AuthContext";
import LoadingBox from "components/LoadingBox";
import Pokemon from "./Pokemon";

function PokemonsList() {
  const { currentAuthToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState([]);

  const loadPokemons = useCallback(async () => {
    const response = await fetch(
      "/api/pokemons?page[number]=1&page[size]=151",
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer token=${currentAuthToken}`,
        },
      }
    );
    const { data: pokemons } = await response.json();
    setLoading(false);
    setPokemons(pokemons);
  }, [currentAuthToken]);

  useEffect(() => {
    loadPokemons();
  }, [loadPokemons]);

  return loading ? (
    <LoadingBox />
  ) : (
    <div className="flex flex-row flex-wrap justify-center">
      {pokemons.map((pokemon) => (
        <Pokemon key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
}

export default PokemonsList;
