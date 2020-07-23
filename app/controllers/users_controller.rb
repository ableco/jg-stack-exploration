class UsersController < ApplicationController
  include Authenticatable

  before_action :authenticate!, only: [:show]

  def show
    render jsonapi: UserResource.find(id: current_user.id)
  end
end
