<template>
  <div>
    <b-button variant="primary" @click="openNewIngredientForm()">
      CREATE NEW INGREDIENT
    </b-button>
    <IngredientForm
        :modalShown="newIngredientModalShown"
        @confirm-modal="createNewIngredient($event)"
        @close-modal="newIngredientModalShown=false"/>
    <IngredientForm
        :modalShown="editIngredientModalShown"
        :initialIngredient="selectedIngredient"
        @confirm-modal="updateIngredient($event)"
        @close-modal="editIngredientModalShown=false"/>
    <div class="recipes-container">
      <b-list-group>
        <b-list-group-item
            class="recipe-name"
            v-for="ingredient in ingredientsList" :key="ingredient.id"
            @click="setSelectedIngredient(ingredient)"
            :active="selectedIngredient===ingredient">
          <b-button variant="danger" size="sm"
                    @click.stop="deleteIngredient(ingredient)" class="float-right ml-2"
                    :disabled="!ingredient.id">
            X
          </b-button>
          {{ ingredient.name }}
        </b-list-group-item>
      </b-list-group>
      <div class="recipe-details">
        <div v-if="!!selectedIngredient">
          <h2>{{ selectedIngredient.name }}</h2>
          <b-button @click="openEditIngredientForm()"
                    :disabled="!selectedIngredient.id">
            Edit
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import IngredientForm from "./IngredientForm.vue";
import {IngredientDto} from "smrcek-menu-app/models/backend/ingredient-dto";
import * as _ from "lodash";
export default {
  components: {
    IngredientForm
  },
  props: {
    ingredientsList: Array
  },
  emits: {
  },
  data() {
    return {
      newIngredientModalShown: false,
      editIngredientModalShown: false,
      internalSelectedIngredient: undefined
    }
  },
  computed: {
    selectedIngredient() {
      if (!this.internalSelectedIngredient) {
        return undefined;
      }

      return _.find(this.ingredientsList, ingredient => {
        return ingredient === this.internalSelectedIngredient ||
            (ingredient.id === this.internalSelectedIngredient.id) ||
            (ingredient.creation_id && this.internalSelectedIngredient.creation_id && ingredient.creation_id === this.internalSelectedIngredient.creation_id);
      });
    }
  },
  mounted() {
  },
  methods: {
    setSelectedIngredient(ingredient: IngredientDto) {
      this.internalSelectedIngredient = ingredient;
    },
    openNewIngredientForm() {
      this.newIngredientModalShown = true;
    },
    openEditIngredientForm() {
      this.editIngredientModalShown = true;
    },
    deleteIngredient(ingredient: IngredientDto) {
      this.$store.dispatch('deleteIngredient', ingredient).then(() => {});
    },
    createNewIngredient(newIngredient: IngredientDto) {
      this.$store.dispatch('createNewIngredient', newIngredient).then(response => {
        this.newIngredientModalShown = false;
      });
    },
    updateIngredient(ingredient: IngredientDto) {
      this.$store.dispatch('updateIngredient', ingredient).then(response => {
        this.editIngredientModalShown = false;
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