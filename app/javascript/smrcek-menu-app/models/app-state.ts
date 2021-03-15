// import {Module} from "vuex";
// import {LoggedInUser} from "smrcek-menu-app/models/login/logged-in-user";

import {RecipeDto} from "../models/backend/recipe-dto";
import {IngredientDto} from "../models/backend/ingredient-dto";

export interface AppState {
    appLoaded: boolean;
    recipesList: RecipeDto[];
    ingredientsList: IngredientDto[];
    // LoggedInUserModule: Module<LoggedInUser, AppState>;
}