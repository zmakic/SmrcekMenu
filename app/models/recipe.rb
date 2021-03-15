class Recipe < ApplicationRecord
  belongs_to :user
  has_many :ingredients, through: :recipe_content

  scope :from_user_id, -> (user_id) { where(user_id: user_id)}
end
