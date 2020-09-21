module Mutations
  class CreateInvestment < BaseMutation
    argument :name, String, required: true
    argument :company_id, ID, required: true
    argument :invested, Float, required: true
    argument :initial_valuation, Float, required: true
    argument :expiration_date, GraphQL::Types::ISO8601Date, required: false
    argument :optional_field, String, required: false

    field :investment, Types::InvestmentType, null: true

    def resolve(attributes)
      { investment: Investment.create!(attributes) }
    end
  end
end
