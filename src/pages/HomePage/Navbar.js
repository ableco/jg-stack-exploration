import React, {
  forwardRef,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import Button from "components/Button";
import AuthContext from "AuthContext";
import PokemonImage from "./PokemonImage";

function Navbar(_props, ref) {
  const { logout, currentAuthToken } = useContext(AuthContext);

  const [chosenPokemons, setChosenPokemons] = useState([]);

  const navigate = useNavigate();

  const loadChosenPokemons = useCallback(async () => {
    const response = await fetch("/api/chosen_pokemons?include=pokemon", {
      method: "GET",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer token=${currentAuthToken}`,
      },
    });
    const { data, included } = await response.json();

    setChosenPokemons(
      data.map((chosenPokemon) => {
        const pokemon = included.find(
          (item) =>
            item.type === "pokemons" &&
            item.id === chosenPokemon.attributes.pokemon_id.toString()
        );

        return {
          id: chosenPokemon.id,
          pokemon,
        };
      })
    );
  }, [currentAuthToken]);

  useEffect(() => {
    loadChosenPokemons();
  }, [loadChosenPokemons]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="fixed py-4 px-6 bg-white w-full z-50" ref={ref}>
      <div className="flex">
        <div className="flex">
          {chosenPokemons.map((chosenPokemon) => (
            <PokemonImage pokemon={chosenPokemon.pokemon} size={40} />
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
