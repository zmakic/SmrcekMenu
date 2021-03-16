import { AppState } from '../models/app-state';
import Vue from 'vue';
import Vuex from 'vuex';
import { LoggedInUserModule } from './modules/logged-in-user.module';
import axios from "axios";
import {LoginStateEnum} from "../models/login/login-state-enum";
import {RecipeDto} from "../models/backend/recipe-dto";
import {IngredientDto} from "../models/backend/ingredient-dto";
import _ from 'lodash';
import {RecipeContentDto} from "smrcek-menu-app/models/backend/recipe-content-dto"; // TODO - try to create funciton from here in mylodash

const API_URL = "http://localhost:3000"; // TODO - put in config

Vue.use(Vuex);

const SmrcekMenuAppStore = new Vuex.Store<AppState>({
  state() {
    return {
      appLoaded: false,
      recipesList: [],
      ingredientsList: [],
      recipeContents: {}
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
      newRecipe.creation_id = _.uniqueId('recipe');
      state.recipesList.push(newRecipe);
    },
    updateExistingRecipe(state, { recipeToUpdateId, updatedRecipe }) { // TODO - create type for payload here ????
      const foundRecipeIndex = _.findIndex(state.recipesList, recipe => recipe.id === recipeToUpdateId);
      if (foundRecipeIndex >= 0) {
        Vue.set(state.recipesList, foundRecipeIndex, updatedRecipe);
      }
    },
    updateNewRecipe(state, { recipeToUpdateCreationId, updatedRecipe }) { // TODO - create type for payload here ????
      const foundRecipeIndex = _.findIndex(state.recipesList,
              recipe => recipe.creation_id === recipeToUpdateCreationId);
      if (foundRecipeIndex >= 0) {
        updatedRecipe.creation_id = recipeToUpdateCreationId;
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

    updateRecipeContentsForRecipe(state, { recipeContentsUpdate, recipe_id }) { // TODO - add types somehow ???
      Vue.set(state.recipeContents, recipe_id, recipeContentsUpdate);
      //Vue.set(state, 'recipeContents', state.recipeContents);
      //Vue.set(state, 'recipeContents', ['+recipe_id+']', recipeContentsUpdate);
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

    // TODO - access backend non-stop - add after return to list of ingredients.
    // Try ingredients from server and recipes more responsive
    deleteIngredient({commit, state}, recipe: IngredientDto): Promise<IngredientDto> {
      const userId = (state as any).LoggedInUserModule.userId;
      return axios.delete<IngredientDto>(API_URL+ "/users/" + userId + '/ingredients/' + recipe.id + '.json').then(
          response => {
            this.dispatch('loadIngredients');
            return response.data;
          }
      );
      // TODo - check what exactly deltee returns ??
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
      return axios.post<IngredientDto>(API_URL+"/users/" + userId + '/ingredients.json', { ingredient: ingredient }).then(
          response => {
            this.dispatch('loadIngredients');
            return response.data;
          }
      );
    },
    updateIngredient({commit, state}, ingredient: IngredientDto): Promise<IngredientDto> {
      const userId = (state as any).LoggedInUserModule.userId;
      return axios.put<IngredientDto>(API_URL+"/users/" + userId + '/ingredients/' + ingredient.id + '.json', { ingredient: ingredient }).then(
          response => {
            this.dispatch('loadIngredients');
            return response.data;
          }
      );
    },

    // TODO - not access backend non-stop. DO not refresh whole list!
    // Try recipes more responsive and ingredients from server
    deleteRecipe({commit, state}, recipe: RecipeDto): Promise<RecipeDto> {
      const userId = (state as any).LoggedInUserModule.userId;
      axios.delete<RecipeDto>(API_URL+ "/users/" + userId + '/recipes/' + recipe.id + '.json').then(
          // TODO - config recipe deteled
      );
      // TODo - check what exactly deltee returns ??

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
      axios.post<RecipeDto>(API_URL+"/users/" + userId + '/recipes.json', { recipe: recipe })
        .then(response => {
          // TODO - for checking how it updates UI
          setTimeout(() => {
            commit("updateNewRecipe", {
              recipeToUpdateCreationId: recipe.creation_id,
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
    },
    updateRecipe({commit, state}, recipe: RecipeDto): Promise<RecipeDto> {
      const userId = (state as any).LoggedInUserModule.userId;
      axios.put<RecipeDto>(API_URL + "/users/" + userId + '/recipes/' + recipe.id + '.json', {recipe: recipe})
          .then(response => {
            // TODO - for checking how it updates UI
            setTimeout(() => {
              commit("updateExistingRecipe", {
                recipeToUpdateId: recipe.id,
                updatedRecipe: response.data
              });
            }, 2000);

            return response.data;
          })
          .catch(error => {
            console.log('update error', error);
            // TODO - restore old data
            throw error;
          });

      return new Promise<RecipeDto>(resolve => {
        this.commit('updateExistingRecipe', {
          recipeToUpdateId: recipe.id,
          updatedRecipe: recipe
        });
        resolve(recipe);
      });
    },

    loadRecipeContentsForRecipe({commit, state}, recipe: RecipeDto): Promise<RecipeContentDto[]> {
      const userId = (state as any).LoggedInUserModule.userId;
      return axios.get<RecipeContentDto[]>(API_URL + "/users/" + userId + '/recipes/' + recipe.id + '/recipe_contents.json').then(response =>
      {
        this.commit("updateRecipeContentsForRecipe", { recipeContentsUpdate: response.data, recipe_id: recipe.id });
        return response.data;
      });
    },
    addRecipeContent({commit, state}, recipeContent: RecipeContentDto) {

    },
    deleteRecipeContent({ commit, state, dispatch }, { recipe, recipeContent }) {
      const userId = (state as any).LoggedInUserModule.userId;
      axios.delete(API_URL + "/users/" + userId + '/recipes/' + recipe.id + '/recipe_contents/' + recipeContent.id + '.json')
          .then(result => {
            dispatch('loadRecipeContentsForRecipe', recipe);
          });
      // TODO - need other call for all to work
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
