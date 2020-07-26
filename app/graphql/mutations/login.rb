module Mutations
  class Login < BaseMutation
    argument :username, String, required: true
    argument :password, String, required: true

    field :auth_token, Types::AuthTokenType, null: true

    def resolve(username:, password:)
      user = User.find_by(username: username)&.authenticate(password)

      if user.present?
        { auth_token: user.auth_tokens.create }
      else
        raise GraphQL::ExecutionError, "User not found"
      end
    end
  end
end
