module Mutations
  class AddPokemon < BaseMutation
    argument :pokemon_id, ID, required: true

    field :success, Boolean, null: false

    def resolve(pokemon_id:)
      require_authentication!

      chosen_pokemon = current_user.chosen_pokemons.create(pokemon_id: pokemon_id)
      sleep 3
      { success: chosen_pokemon.persisted? }
    end
  end
end
