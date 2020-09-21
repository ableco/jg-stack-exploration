module Types
  class MutationType < Types::BaseObject
    field :login, mutation: Mutations::Login
    field :logout, mutation: Mutations::Logout
    field :create_investment, mutation: Mutations::CreateInvestment
  end
end
