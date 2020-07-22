class PokemonsController < ApplicationController
  def index
    pokemons = PokemonResource.all(params)
    render jsonapi: pokemons
  end

  def show
    pokemon = PokemonResource.find(params)
    render jsonapi: pokemon
  end
end
