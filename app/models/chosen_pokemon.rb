class ChosenPokemon < ApplicationRecord
  belongs_to :pokemon
  belongs_to :user

  validates :pokemon_id, uniqueness: { scope: :user_id }
end
