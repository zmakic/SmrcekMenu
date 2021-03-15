class Ingredient < ApplicationRecord
  belongs_to :user
  has_many :recipes, through: :recipe_content

  scope :from_user_id, -> (user_id) { where(user_id: user_id)} # TODO - maybe ask whole user in scope and handle null here ????
end
