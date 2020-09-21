module Types
  class InvestmentType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :invested, Float, null: false
    field :expiration_date, GraphQL::Types::ISO8601Date, null: true
    field :optional_field, String, null: true
    field :value, Float, null: true

    field :company, Types::CompanyType, null: false
  end
end
