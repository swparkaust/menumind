Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :users, param: :uuid, only: [ :show, :create, :update, :destroy ]

      resources :menu_options, only: [ :index ] do
        collection do
          get :food_types
          get :cuisine_types
          get :situations
        end
      end

      scope "/users/:user_uuid" do
        resources :recommendations, only: [ :index, :create ] do
          member do
            patch :respond
          end
          collection do
            get :greeting
            get :insights
          end
        end
      end
    end
  end
end
