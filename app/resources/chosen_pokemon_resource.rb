class ChosenPokemonResource < ApplicationResource
  attribute :pokemon_id, :integer

  belongs_to :pokemon
end
