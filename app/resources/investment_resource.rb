class InvestmentResource < JSONAPI::Resource
  attributes  :name, :invested, :expiration_date, :optional_field, :company_id, :initial_valuation,
              :updated_at, :value

  belongs_to :company

  def self.default_sort
    [{ field: :updated_at, direction: :desc }]
  end

  def self.records_for_populate(options = {})
    super(options).includes(:valuations)
  end
end
