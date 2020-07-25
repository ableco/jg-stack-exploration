import React, { forwardRef, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "components/Button";
import AuthContext from "AuthContext";
import PokemonImage from "./PokemonImage";
import useSWR from "swr";

function Navbar(_props, ref) {
  const { logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const {
    data: { data: chosenPokemonItems, included: includedPokemons },
  } = useSWR("/api/chosen_pokemons?include=pokemon");

  const chosenPokemons = useMemo(() => {
    return chosenPokemonItems.map((chosenPokemon) => {
      const pokemon = includedPokemons.find(
        (item) =>
          item.type === "pokemons" &&
          item.id === chosenPokemon.attributes.pokemon_id.toString()
      );

      return {
        id: chosenPokemon.id,
        pokemon,
      };
    });
  }, [chosenPokemonItems, includedPokemons]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="fixed py-4 px-6 bg-white w-full z-50" ref={ref}>
      <div className="flex">
        <div className="flex">
          {chosenPokemons.map((chosenPokemon) => (
            <PokemonImage
              key={chosenPokemon.id}
              pokemon={chosenPokemon.pokemon}
              size={40}
            />
          ))}
        </div>
        <Button variant="secondary" onClick={handleLogout} className="ml-auto">
          Logout
        </Button>
      </div>
    </div>
  );
}

export default forwardRef(Navbar);
