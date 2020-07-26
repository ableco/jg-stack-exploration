module Types
  class QueryType < Types::BaseObject
    field :current_user, Types::UserType, null: true
    field :pokemons, [Types::PokemonType], null: false
    field :chosen_pokemons, [Types::PokemonType], null: false

    def current_user
      context[:current_user]
    end

    def pokemons
      Pokemon.all.limit(151)
    end

    def chosen_pokemons
      current_user.pokemons
    end
  end
end
