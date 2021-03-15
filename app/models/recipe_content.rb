class RecipeContent < ApplicationRecord
  belongs_to :recipe
  belongs_to :ingredient
  belongs_to :user

  scope :from_user_id, -> (user_id) { where(user_id: user_id)}
end
