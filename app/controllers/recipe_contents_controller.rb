class RecipeContentsController < ApplicationController
  before_action :set_user
  before_action :set_recipe

  def index
    @recipe_contents = RecipeContent.from_user_id(@user.id).where(recipe_id: @recipe.id).all
  end

  def create
    @recipe_content = RecipeContent.from_user_id(@user.id).where(recipe_id: @recipe.id).new(recipe_contents_params)

    respond_to do |format|
      if @recipe_content.save
        format.json { render :show, status: :created,
          location: user_recipe_recipe_content_path(@recipe_content.user_id, @recipe_content.recipe_id, @recipe_content.id) }
      else
        format.json { render json: @recipe_content.errors, status: :unprocessable_entity }
      end
    end
  end

  def show
    @recipe_content = RecipeContent.find_by_user_id_and_recipe_id(@user.id, params[:recipe_id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:user_id])
    end

    def set_recipe
      @recipe = Recipe.from_user_id(@user.id).find(params[:recipe_id])
    end

    # Only allow a list of trusted parameters through.
    def recipe_contents_params
      params.require(:recipe_content).permit(:ingredient_id)
    end
end