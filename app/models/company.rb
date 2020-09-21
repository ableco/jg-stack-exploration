class Company < ApplicationRecord
  has_many :investments

  scope :in_alphabetical_order, -> { order(name: :asc) }

  def recalculate_value
    update(value: investments.sum(:value))
  end
end
