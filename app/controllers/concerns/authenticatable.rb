module Authenticatable
  extend ActiveSupport::Concern
  include ActionController::HttpAuthentication::Token::ControllerMethods

  included do
    before_action :load_current_user
  end

  attr_reader :current_auth_token, :current_user

  def load_current_user
    authenticate_with_cookie
    authenticate_with_token if @current_user.nil?
  end

  private

  attr_writer :current_auth_token, :current_user

  def authenticate_with_cookie
    token = request.cookies["AUTH_TOKEN"]
    if token.present?
      load_user_from_token(token)
    end
  end

  def authenticate_with_token
    authenticate_with_http_token do |token|
      load_user_from_token(token)
    end
  end

  def load_user_from_token(token)
    auth_token = AuthToken.find_by_token(token)
    if auth_token
      self.current_auth_token = auth_token
      self.current_user = auth_token.user
    end
  end
end
