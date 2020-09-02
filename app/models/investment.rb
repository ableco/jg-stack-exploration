class Investment < ApplicationRecord
  belongs_to :company
  has_many :chores
  has_many :reminders
  has_many :valuations
end
