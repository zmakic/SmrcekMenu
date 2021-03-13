Rails.application.routes.draw do
  get 'smrcek_menu_app/index'
  root to: 'landing#index'

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
