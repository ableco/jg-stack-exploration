class ChosenPokemonResource < ApplicationResource
  attribute :pokemon_id, :integer
  attribute :user_id, :integer, only: [:writable]

  belongs_to :pokemon

  def base_scope
    current_user.chosen_pokemons
  end

  def create(attributes)
    current_user.chosen_pokemons.create(attributes)
  end
end
