class Company < ApplicationRecord
  has_many :investments

  def valuation
    investments.sum do |investment|
      investment.value
    end
  end
end
