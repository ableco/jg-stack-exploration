class User < ApplicationRecord
  has_secure_password

  has_many :chosen_pokemons
  has_many :pokemons, through: :chosen_pokemons
  has_many :auth_tokens
end
