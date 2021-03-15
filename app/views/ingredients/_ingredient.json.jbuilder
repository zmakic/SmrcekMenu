json.extract! ingredient, :id, :name, :user_id, :created_at, :updated_at
json.url user_ingredient_url(ingredient.user_id, ingredient, format: :json)
