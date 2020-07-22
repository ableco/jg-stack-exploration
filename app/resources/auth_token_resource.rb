class AuthTokenResource < ApplicationResource
  attribute :token, :string, only: [:readable, :schema]
  attribute :expires_at, :datetime, only: [:readable, :schema]

  attribute :username, :string, only: [:writable, :schema]
  attribute :password, :string, only: [:writable, :schema]
end
