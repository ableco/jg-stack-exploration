module Types
  class NavbarType < Types::BaseObject
    field :companies, [Types::CompanyType], null: false
    field :chores, [Types::ChoreType], null: false
    field :reminders, [Types::ReminderType], null: false
  end
end
