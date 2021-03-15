import { AppState } from 'smrcek-menu-app/models/app-state';
import Vue from 'vue';
import Vuex from 'vuex';
import { LoggedInUserModule } from './modules/logged-in-user.module';
import axios from "axios";
import {LoginStateEnum} from "smrcek-menu-app/models/login/login-state-enum";
import {RecipeDto} from "smrcek-menu-app/models/backend/recipe-dto";
import {IngredientDto} from "smrcek-menu-app/models/backend/ingredient-dto";
import _ from 'lodash'; // TODO - try to create funciton from here in mylodash

const API_URL = "http://localhost:3000"; // TODO - put in config

Vue.use(Vuex);

const SmrcekMenuAppStore = new Vuex.Store<AppState>({
  state() {
    return {
      appLoaded: false,
      recipesList: [],
      ingredientsList: []
    }
  },
  modules: {
    LoggedInUserModule: LoggedInUserModule
  },
  mutations: {
    appLoaded(state) {
      state.appLoaded = true;
    },
    addNewRecipe(state, newRecipe: RecipeDto) {
      state.recipesList.push(newRecipe);
    },
    updateNewRecipe(state, { recipeToUpdate, updatedRecipe }) {
      const foundRecipeIndex = _.findIndex(state.recipesList, recipe => recipe === recipeToUpdate);
      if (foundRecipeIndex >= 0) {
        Vue.set(state.recipesList, foundRecipeIndex, updatedRecipe);
      }
    },
    removeRecipe(state, recipeToRemove: RecipeDto) {
      const indexToRemove = _.findIndex(state.recipesList, recipe => recipe.id === recipeToRemove.id);
      if (indexToRemove >= 0) {
        state.recipesList.splice(indexToRemove, 1);
      }
    },
    updateRecipesList(state, newList: RecipeDto[]) {
      Vue.set(state, 'recipesList', newList);
    },
    updateIngredientsList(state, newList: IngredientDto[]) {
      Vue.set(state, 'ingredientsList', newList);
    },
    clearData(state) {
      Vue.set(state, 'recipesList', []);
      Vue.set(state, 'ingredientsList', []);
    }
  },
  actions: {
    // TODO - separate into 2 modules, one for ingredients, one for recipes!
    clearData( { commit }) {
      commit("clearData");
    },
    loadIngredients({commit, state}): Promise<IngredientDto[]> {
      const userId = (state as any).LoggedInUserModule.userId;
      if (userId) {
        return axios.get<IngredientDto[]>(API_URL + "/users/" + userId + '/ingredients.json').then(response => {
          commit("updateIngredientsList", response.data);



          return response.data;
        });
      } else {
        return new Promise<IngredientDto[]>(resolve => []);
      }
    },
    createNewIngredient({commit, state}, ingredient: IngredientDto): Promise<IngredientDto> {
      const userId = (state as any).LoggedInUserModule.userId;
      return axios.post<IngredientDto>(API_URL+"/users/" + userId + '/recipes.json', { ingredient: ingredient }).then(
          response => {
            this.dispatch('loadIngredients');
            return response.data;
          }
      );
    },
    deleteRecipe({commit, state}, recipe: RecipeDto): Promise<RecipeDto> {
      const userId = (state as any).LoggedInUserModule.userId;
      axios.delete<IngredientDto>(API_URL+ "/users/" + userId + '/recipes/' + recipe.id + '.json').then(
      );

      return new Promise<RecipeDto>(resolve => {
        this.commit('removeRecipe', recipe);
        resolve(recipe);
      });
    },
    loadRecipes( { commit, state } ): Promise<RecipeDto[]> {
      const userId = (state as any).LoggedInUserModule.userId;
      if (userId) {
        return axios.get<RecipeDto[]>(API_URL + "/users/" + userId + '/recipes.json').then(response => {
          commit("updateRecipesList", response.data);

          return response.data;
        });
      } else {
        return new Promise<RecipeDto[]>(resolve => []);
      }
    },
    createNewRecipe({commit, state}, recipe: RecipeDto): Promise<RecipeDto> {
      const userId = (state as any).LoggedInUserModule.userId;
      // TODO - or to not access backend non-stop - add here to the list of recipes!
      // Try recipes like this and ingredients from server
      axios.post<RecipeDto>(API_URL+"/users/" + userId + '/recipes.json', { recipe: recipe })
        .then(response => {
          // TODO - for checking how it updates UI
          setTimeout(() => {
            commit("updateNewRecipe", {
              recipeToUpdate: recipe,
              updatedRecipe: response.data
            });
          }, 2000);

          return response.data;
        }) // TODO - maybe override created recipe?
        .catch(error => {
          console.log('create error', error);
          // TODO - remove newly added recipe from the list
          throw error;
      })

      return new Promise<RecipeDto>(resolve => {
        this.commit('addNewRecipe', recipe);
        resolve(recipe);
      });

      // TODO - or refresh fom server always.
      // return axios.post<RecipeDto>(API_URL+"/users/" + userId + '/recipes.json', { recipe: recipe }).then(
      //     response => {
      //       this.dispatch('loadRecipes');
      //       return response.data;
      //     }
      // );
    }
  }
});

const AUTO_LOAD_RECIPES = true;

// TODO - check how this works
// Watcher - a little bit of separated logic between stores. See how it works out.
SmrcekMenuAppStore.watch(
    // When the returned result changes...
    (state) => {
      return (state as any).LoggedInUserModule.loginState;
    },
    // Run this callback
    (newValue, oldValue) => {
      if (AUTO_LOAD_RECIPES) {
        if (newValue === LoginStateEnum.LOGGED_IN) {
          SmrcekMenuAppStore.dispatch("loadRecipes");
        }
      }
      if (newValue === LoginStateEnum.NOT_LOGGED_IN) {
        SmrcekMenuAppStore.dispatch("clearData");
      }
    }
)


export { SmrcekMenuAppStore };
