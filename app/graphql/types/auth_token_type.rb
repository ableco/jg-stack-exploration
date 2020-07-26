module Types
  class AuthTokenType < Types::BaseObject
    description "An auth token"

    field :token, String, null: false
    field :expires_at, String, null: false
  end
end
