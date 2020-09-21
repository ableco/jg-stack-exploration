module Types
  class QueryType < Types::BaseObject
    field :current_user, Types::UserType, null: true
    field :investments, [Types::InvestmentType], null: true

    field :navbar, Types::NavbarType, null: true

    field :companies, [Types::CompanyType], null: true
    field :chores, [Types::ChoreType], null: true
    field :reminders, [Types::ReminderType], null: true

    def current_user
      context[:current_user]
    end

    def investments
      Investment.most_recent_first.includes(:company)
    end

    def navbar
      {
        companies: companies,
        chores: chores.includes(:investment),
        reminders: reminders.includes(:investment)
      }
    end

    def companies
      Company.all.in_alphabetical_order
    end

    def chores
      Chore.all
    end

    def reminders
      Reminder.all
    end
  end
end
