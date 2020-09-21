module Types
  class ReminderType < Types::BaseObject
    field :id, ID, null: false
    field :investment, Types::InvestmentType, null: false
  end
end
