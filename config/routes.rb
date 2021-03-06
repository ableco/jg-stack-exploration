Rails.application.routes.draw do
  post "/graphql", to: "graphql#execute"

  root to: "home#index"

  # If the catch-all route catches an HTML route, redirect to the frontend application
  # instead of raising a RoutingError.
  get "*path", to: "home#index", constraints: ->(request) do
    request.format.html?
  end
end
