module Types
  class ChoreType < Types::BaseObject
    field :id, ID, null: false
    field :investment, Types::InvestmentType, null: false
  end
end
