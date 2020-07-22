class AuthTokensController < ApplicationController
  include Authenticatable

  before_action :authenticate!, only: [:destroy]

  def create
    attributes = AuthTokenResource.build(params).payload.attributes
    login!(attributes[:username], attributes[:password])
    auth_token = AuthTokenResource.find(id: current_auth_token.id)
    render jsonapi: auth_token, status: :created
  end

  def destroy
    auth_token = AuthTokenResource.find(id: current_auth_token.id)

    if auth_token.destroy
      render jsonapi: { meta: {} }, status: :no_content
    else
      render jsonapi_errors: auth_token
    end
  end
end
