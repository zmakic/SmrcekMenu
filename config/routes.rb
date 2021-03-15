Rails.application.routes.draw do
  root to: 'landing#index'

  resources :users do
    resources :recipes
  end
  # mount JasmineRails::Engine => '/specs' if defined?(JasmineRails) TODO - see what with jasmine

  get 'smrcek_menu_app/index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
