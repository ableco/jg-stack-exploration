Rails.application.routes.draw do
  mount VandalUi::Engine, at: '/vandal'

  root to: "home#index"
  get "/schema.json", to: redirect("/vandal/schema.json")

  scope ApplicationResource.endpoint_namespace, defaults: { format: :jsonapi } do
    resources :pokemons, only: [:index, :show]
    resources :chosen_pokemons, only: [:index, :create, :destroy]
  end
end
