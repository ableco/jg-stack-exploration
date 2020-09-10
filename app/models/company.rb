class Company < ApplicationRecord
  has_many :investments

  def recalculate_value
    update(value: investments.sum(:value))
  end
end
