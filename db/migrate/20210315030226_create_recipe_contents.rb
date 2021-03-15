class CreateRecipeContents < ActiveRecord::Migration[6.0]
  def change
    create_table :recipe_contents do |t|
      t.belongs_to :ingredient, null: false, foreign_key: true
      t.belongs_to :recipe, null: false, foreign_key: true
      t.belongs_to :user, null: false, foreign_key: true
      t.integer :amount

      t.timestamps
    end
  end
end
