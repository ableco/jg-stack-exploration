class InvestmentResource < JSONAPI::Resource
  attributes :name, :invested, :expiration_date, :optional_field, :company_id
end
