class CompanyResource < JSONAPI::Resource
  attributes :name, :valuation

  def self.records_for_populate(options = {})
    super(options).includes(investments: :valuations)
  end
end
