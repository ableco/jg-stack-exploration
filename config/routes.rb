Rails.application.routes.draw do
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end
  post "/graphql", to: "graphql#execute"
  mount VandalUi::Engine, at: '/vandal'

  root to: "home#index"
  get "/schema.json", to: redirect("/vandal/schema.json")

  scope ApplicationResource.endpoint_namespace, defaults: { format: :jsonapi } do
    resources :pokemons, only: [:index, :show]
    resources :chosen_pokemons, only: [:index, :create, :destroy]
    resources :auth_tokens, only: [:create, :destroy]
    resources :users, only: [:show]
  end

  # If the catch-all route catches an HTML route, redirect to the frontend application
  # instead of raising a RoutingError.
  get "*path", to: "home#index", constraints: ->(request) do
    request.format.html?
  end
end
