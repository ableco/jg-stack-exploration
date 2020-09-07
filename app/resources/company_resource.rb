class CompanyResource < JSONAPI::Resource
  # Valuation makes too many SQL requests
  attributes :name, :valuation
end
