<template>
  <b-modal
      ref="modal"
      @hide="closeModal($event)"
      @close="closeModal($event)">
    <template #modal-title>
      <span v-if="!!initialIngredient">
        Edit ingredient
      </span>
      <span v-if="!initialIngredient">
        New ingredient
      </span>
    </template>

    <template #default>
      Name:
      <input
          v-model="ingredient.name"
          type="text"
      >
    </template>

    <template #modal-footer="{ ok, cancel, hide }">
      <b-button variant="primary" @click="confirmModal()" left>
        <span v-if="!!initialIngredient">
          Update
        </span>
        <span v-if="!initialIngredient">
          Create
        </span>
      </b-button>
      <b-button @click="closeModal()">
        Cancel
      </b-button>
    </template>
    <!--  </Modal>-->
  </b-modal>
</template>

<script lang="ts">

import {IngredientDto} from "smrcek-menu-app/models/backend/ingredient-dto";

export default {
  components: {},
  props: {
    modalShown: Boolean,
    initialIngredient: Object
  },
  emits: {
    'close-modal': null,
    'confirm-modal': null
  },
  data() {
    return {
      ingredient: Object.assign({}, this.initialRecipe ) // Guard against undefined object and having to check for them. Also copy data.
    }
  },
  watch: {
    modalShown(newVal, oldVal) { // TODO - mixin ?
      if (newVal === true && newVal !== oldVal) {
        this.ingredient = Object.assign({}, this.initialIngredient );
        this.$refs.modal.show();
      } else if (newVal === false && newVal !== oldVal) {
        this.$refs.modal.hide();
        // Clear data also when closing
        this.name = undefined;
      }
    }
  },
  mounted() {
  },
  methods: {
    closeModal() {
      this.$emit('close-modal');
    },

    confirmModal() {
      this.$emit('confirm-modal', this.ingredient);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>