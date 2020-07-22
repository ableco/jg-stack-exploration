class ApplicationController < ActionController::Base
  skip_before_action :verify_authenticity_token

  rescue_from Authenticatable::UnauthorizedError do
    head :unauthorized
  end
end
