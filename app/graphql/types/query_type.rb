module Types
  class QueryType < Types::BaseObject
    field :current_user, Types::UserType, null: true
    field :pokemons, [Types::PokemonType], null: false
    field :chosen_pokemons, [Types::PokemonType], null: false

    def current_user
      context[:current_user]
    end

    def pokemons
      chosen_pokemon_ids = current_user.pokemons.ids

      Pokemon.all.limit(151).each do |pokemon|
        pokemon.chosen = chosen_pokemon_ids.include?(pokemon.id)
      end
    end

    def chosen_pokemons
      current_user.pokemons.each do |pokemon|
        pokemon.chosen = true
      end
    end
  end
end
