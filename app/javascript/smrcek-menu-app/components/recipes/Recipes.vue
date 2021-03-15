<template>
  <div>
    <b-button variant="primary" @click="openRecipeForm()">
      CREATE NEW RECIPE
    </b-button>
    <NewRecipe
        :modalShown="recipeModalShown"
        @confirm-modal="createNewRecipe($event)"
        @close-modal="recipeModalShown=false"/>
    <div class="recipes-container">
      <b-list-group>
        <b-list-group-item
          class="recipe-name"
          v-for="recipe in recipesList" :key="recipe.id"
          @click="selectedRecipe=recipe"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import NewRecipe from "smrcek-menu-app/components/recipes/NewRecipe.vue";
import {RecipeDto} from "smrcek-menu-app/models/backend/recipe-dto";
export default {
  name: "Recipes",
  components: {
    NewRecipe
  },
  props: {
    recipesList: Array
  },
  emits: {
  },
  data() {
    return {
      recipeModalShown: false,
      selectedRecipe: undefined
    }
  },
  mounted() {
  },
  methods: {
    openRecipeForm() {
      this.recipeModalShown = true;
    },
    deleteRecipe(recipe: RecipeDto) {
      this.$store.dispatch('deleteRecipe', recipe).then(() => {
        if (this.selectedRecipe && recipe && recipe.id === this.selectedRecipe.id) {
          this.selectedRecipe = undefined;
        }
      });
    },
    createNewRecipe(newRecipe: RecipeDto) {
      console.log('new recipe', newRecipe);
      this.$store.dispatch('createNewRecipe', newRecipe).then(response => {
        this.recipeModalShown = false;
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