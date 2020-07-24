class ChosenPokemonsController < ApplicationController
  include Authenticatable

  before_action :authenticate!

  def index
    chosen_pokemons = ChosenPokemonResource.all(params)
    render jsonapi: chosen_pokemons
  end

  def create
    chosen_pokemon = ChosenPokemonResource.build(params)

    if chosen_pokemon.save
      render jsonapi: chosen_pokemon, status: 201
    else
      render jsonapi_errors: chosen_pokemon
    end
  end

  def destroy
    chosen_pokemon = ChosenPokemonResource.find(params)

    if chosen_pokemon.destroy
      render jsonapi: { meta: {} }, status: 200
    else
      render jsonapi_errors: chosen_pokemon
    end
  end
end
