json.extract! recipe_content, :id, :recipe_id, :ingredient_id, :amount, :created_at, :updated_at
json.url user_recipe_recipe_content_path(recipe_content.user_id, recipe_content.recipe_id, recipe_content.id)
