<template>
  <b-list-group>
    <b-list-group-item
        v-for="recipeContent in recipeContentsForDisplay"
        :key="recipeContent.originalDto.id">
              <span>
                {{ recipeContent.name }} ({{ recipeContent.amount }})
              </span>
      <b-button variant="danger" size="sm"
                @click.stop="deleteRecipeContent(recipeContent)" class="float-right ml-2"
                :disabled="!recipeContent.originalDto || !recipeContent.originalDto.id">
        X
      </b-button>
    </b-list-group-item>
  </b-list-group>
</template>

<script lang="ts">

import {RecipeContentDto} from "smrcek-menu-app/models/backend/recipe-content-dto";
import {IngredientDto} from "smrcek-menu-app/models/backend/ingredient-dto";
import * as _ from "lodash";

interface InternalRecipeContent {
  name: string;
  amount: number;
  originalDto: RecipeContentDto;
}

function mapToInternalRecipeContent(recipeContent: RecipeContentDto, ingredients: IngredientDto[]): InternalRecipeContent {
  const ingredient = _.find(ingredients, ing => ing.id === recipeContent.id);
  return {
    name: ingredient ? ingredient.name : 'Unnamed ingredient',
    amount: recipeContent.amount,
    originalDto: recipeContent
  }
}

export default {
  components: {},
  props: {
    recipe: Object,
    ingredientsList: Array,
    recipeContents: Array
  },
  computed: {
    recipeContentsForDisplay(): InternalRecipeContent[] {
      return _.map(this.recipeContents, rc => mapToInternalRecipeContent(rc, this.ingredientsList));
    }
  },
  emits: {  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    deleteRecipeContent(recipeContent: InternalRecipeContent) {
      this.$store.dispatch('deleteRecipeContent', {
        recipe: this.recipe,
        recipeContent: recipeContent.originalDto
      }).then(response => {
        this.editRecipeModalShown = false;
      });
    }
  },
};
</script>

<style lang="scss" scoped>

</style>