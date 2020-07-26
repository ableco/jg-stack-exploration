module Mutations
  class Logout < BaseMutation
    field :success, Boolean, null: false

    def resolve
      require_authentication!
      { success: current_auth_token.destroy }
    end
  end
end
