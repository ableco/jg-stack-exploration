class User < ApplicationRecord
  has_secure_password

  has_many :chosen_pokemons
end
