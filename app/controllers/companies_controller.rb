class CompaniesController < ApplicationController
  include JSONAPI::ActsAsResourceController
  include Authenticatable

  before_action do
    head :unauthorized if current_user.nil?
  end
end