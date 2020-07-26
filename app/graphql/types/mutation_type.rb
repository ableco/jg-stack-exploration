module Types
  class MutationType < Types::BaseObject
    field :login, mutation: Mutations::Login
    field :logout, mutation: Mutations::Logout
    field :add_pokemon, mutation: Mutations::AddPokemon
    field :remove_pokemon, mutation: Mutations::RemovePokemon
  end
end
