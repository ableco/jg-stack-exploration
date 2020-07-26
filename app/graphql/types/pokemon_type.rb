module Types
  class PokemonType < Types::BaseObject
    description "A pokemon"

    field :name, String, null: false
    field :number, String, null: false
    field :image_url, String, null: false
  end
end
