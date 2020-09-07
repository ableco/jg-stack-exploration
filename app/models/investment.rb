class Investment < ApplicationRecord
  belongs_to :company
  has_many :chores
  has_many :reminders
  has_many :valuations

  attr_accessor :initial_valuation

  after_create :create_initial_valuation
  after_create :create_chore
  after_create :create_reminder

  def value
    latest_valuation.amount
  end

  private

  def latest_valuation
    valuations.order(updated_at: :desc).first
  end

  def create_initial_valuation
    if initial_valuation.present?
      valuations.create!(amount: initial_valuation, date: Date.today)
    end
  end

  def create_chore
    if optional_field.blank?
      chores.create!(missing_field: "optional_field")
    end
  end

  def create_reminder
    if expiration_date.present?
      reminders.create!
    end
  end
end
