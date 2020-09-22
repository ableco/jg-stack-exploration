module Types
  class ChoreType < Types::BaseObject
    field :id, ID, null: false
    field :investment, Types::InvestmentType, null: false

    def investment
      BatchLoader::GraphQL.for(object.investment_id).batch do |investment_ids, loader|
        Investment.where(id: investment_ids).each do |investment|
          loader.call(investment.id, investment)
        end
      end
    end
  end
end
