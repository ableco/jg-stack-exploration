module Mutations
  class BaseMutation < GraphQL::Schema::RelayClassicMutation
    argument_class Types::BaseArgument
    field_class Types::BaseField
    input_object_class Types::BaseInputObject
    object_class Types::BaseObject

    def require_authentication!
      return if current_user
      raise GraphQL::ExecutionError, "You need to authenticate to perform this action"
    end

    def current_user
      context[:current_user]
    end

    def current_auth_token
      context[:current_auth_token]
    end
  end
end
