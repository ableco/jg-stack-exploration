class InvestmentResource < JSONAPI::Resource
  attributes  :name, :invested, :expiration_date, :optional_field, :company_id, :initial_valuation,
              :updated_at

  def self.default_sort
    [{ field: :updated_at, direction: :desc }]
  end
end
