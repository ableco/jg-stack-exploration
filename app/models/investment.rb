class Investment < ApplicationRecord
  belongs_to :company

  has_many :chores
  has_many :reminders
  has_many :valuations

  attr_accessor :initial_valuation

  after_create :create_initial_valuation
  after_create :create_chore

  after_save :maybe_create_reminder
  after_save :update_value

  after_destroy :update_company_value

  scope :most_recent_first, -> { order(updated_at: :desc) }

  private

  def update_value
    latest_valuation = valuations.order(updated_at: :desc).first
    update_columns(value: latest_valuation&.amount || 0)
    update_company_value
  end

  def update_company_value
    company.recalculate_value
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

  def maybe_create_reminder
    if expiration_date.present? && reminders.empty?
      reminders.create!
    end
  end
end
