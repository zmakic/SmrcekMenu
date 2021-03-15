json.extract! recipe, :id, :name, :user_id, :created_at, :updated_at
json.url user_recipe_url(recipe.user_id, recipe, format: :json)
