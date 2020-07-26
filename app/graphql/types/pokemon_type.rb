module Types
  class PokemonType < Types::BaseObject
    description "A pokemon"

    field :id, ID, null: false
    field :name, String, null: false
    field :number, String, null: false
    field :image_url, String, null: false
    field :chosen, Boolean, null: false
  end
end
