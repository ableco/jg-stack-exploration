import React, { forwardRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "components/Button";
import AuthContext from "components/AuthContext";
import PokemonImage from "./PokemonImage";
import useSWR from "swr";
import { gql } from "lib/useGraphqlClient";

const CHOSEN_POKEMONS_QUERY = gql`
  {
    chosenPokemons {
      id
      name
      imageUrl
      number
    }
  }
`;

function Navbar(_props, ref) {
  const { logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const {
    data: { chosenPokemons },
  } = useSWR(CHOSEN_POKEMONS_QUERY);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="fixed py-4 px-6 bg-white w-full z-50" ref={ref}>
      <div className="flex">
        <div className="flex">
          {chosenPokemons.map((pokemon) => (
            <PokemonImage key={pokemon.id} pokemon={pokemon} size={40} />
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
export { CHOSEN_POKEMONS_QUERY };
