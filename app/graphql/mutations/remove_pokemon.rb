module Mutations
  class RemovePokemon < BaseMutation
    argument :pokemon_id, Int, required: true

    field :success, Boolean, null: false

    def resolve(pokemon_id)
      require_authentication!

      destroyed = current_user.chosen_pokemons.find_by(pokemon_id: pokemon_id)&.destroy
      { success: destroyed }
    end
  end
end
