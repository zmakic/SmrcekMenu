<template>
  <div>
    <b-button variant="primary" @click="openNewRecipeForm()">
      CREATE NEW RECIPE
    </b-button>
    <RecipeForm
        :modalShown="newRecipeModalShown"
        @confirm-modal="createNewRecipe($event)"
        @close-modal="newRecipeModalShown=false"/>
    <RecipeForm
        :modalShown="editRecipeModalShown"
        :initialRecipe="selectedRecipe"
        @confirm-modal="updateRecipe($event)"
        @close-modal="editRecipeModalShown=false"/>
    <div class="recipes-container">
      <b-list-group>
        <b-list-group-item
          class="recipe-name"
          v-for="recipe in recipesList" :key="recipe.id"
          @click="setSelectedRecipe(recipe)"
          :active="selectedRecipe===recipe">
          <b-button variant="danger" size="sm"
            @click.stop="deleteRecipe(recipe)" class="float-right ml-2"
            :disabled="!recipe.id">
            X
          </b-button>
          {{ recipe.name }}
        </b-list-group-item>
      </b-list-group>
      <div class="recipe-details">
        <div v-if="!!selectedRecipe">
          <h2>{{selectedRecipe.name}}</h2>
          <b-button @click="openEditRecipeForm()"
                    :disabled="!selectedRecipe.id">
            Edit
          </b-button>
          <b-list-group>
            <b-list-group-item
                v-for="recipeContent in selectedRecipeContents" :key="recipeContent.id"
            >
              <span>
                {{ recipeContent.name }} ({{ recipeContent.amount }})
              </span>
              <b-button variant="danger" size="sm"
                        @click.stop="deleteRecipeContent(recipeContent)" class="float-right ml-2"
                        :disabled="!recipeContent.id">
                X
              </b-button>
            </b-list-group-item>
          </b-list-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import RecipeForm from "./RecipeForm.vue";
import {RecipeDto} from "../../models/backend/recipe-dto";
import * as _ from "lodash";
import axios from "axios";
export default {
  components: {
    RecipeForm
  },
  props: {
    recipesList: Array,
    ingredientsList: Array
  },
  emits: {
  },
  data() {
    return {
      newRecipeModalShown: false,
      editRecipeModalShown: false,
      internalSelectedRecipe: undefined,

      recipeContents: [] // TODO - move to store, maybe
    }
  },
  computed: {
    selectedRecipeContents() {
      return _.map(_.filter(this.recipeContents, content => content.recipe_id == this.internalSelectedRecipe.id), recipeContent => {
        const ingredient = _.find(this.ingredientsList, ing => ing.id === recipeContent.ingredient_id);
        if (ingredient) {
          recipeContent.name = ingredient.name; // TODO - is ok to mutate here ??? probably not, find a nicer solution
        }

        return recipeContent;
      });
    },
    selectedRecipe() {
      if (!this.internalSelectedRecipe) {
        return undefined;
      }

      return _.find(this.recipesList, recipe => {
        return recipe === this.internalSelectedRecipe ||
            (recipe.id === this.internalSelectedRecipe.id) ||
            (recipe.creation_id && this.internalSelectedRecipe.creation_id && recipe.creation_id === this.internalSelectedRecipe.creation_id);
      });
    }
  },
  mounted() {
  },
  methods: {
    setSelectedRecipe(recipe: RecipeDto) {
      this.internalSelectedRecipe = recipe;

      // TODO - just hacked here for now. should move to store! but be careful about overlappinh ajax calls
      axios.get("http://localhost:3000/users/" + 1 + '/recipes/' + recipe.id + '/recipe_contents.json').then(response => {
        console.log('contents for recipe', recipe, response);

        this.recipeContents = response.data;

        console.log('content set', this.recipeContents);
      });
    },
    openNewRecipeForm() {
      this.newRecipeModalShown = true;
    },
    openEditRecipeForm() {
      this.editRecipeModalShown = true;
    },
    deleteRecipe(recipe: RecipeDto) {
      this.$store.dispatch('deleteRecipe', recipe).then(() => {});
    },
    createNewRecipe(newRecipe: RecipeDto) {
      this.$store.dispatch('createNewRecipe', newRecipe).then(response => {
        this.newRecipeModalShown = false;
      });
    },
    updateRecipe(recipe: RecipeDto) {
      this.$store.dispatch('updateRecipe', recipe).then(response => {
        this.editRecipeModalShown = false;
      });
    },
    deleteRecipeContent(recipeContent) {
      this.$store.dispatch('deleteRecipeContent', recipeContent).then(response => {
        this.editRecipeModalShown = false;
      });
    }
  },
};

</script>

<style scoped>
.recipes-container {
  margin-top: 20px;
  flex-direction: row;
  box-sizing: border-box;
  display: flex;
}

.recipe-name {
  cursor: pointer;
}

.recipe-details {
  margin-left: 20px;
}
</style>