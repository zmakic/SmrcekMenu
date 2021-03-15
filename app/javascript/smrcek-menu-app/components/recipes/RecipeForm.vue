<template>
  <b-modal
      ref="modal"
      @hide="closeModal($event)"
      @close="closeModal($event)">
    <template #modal-title>
      <span v-if="!!initialRecipe">
        Edit recipe
      </span>
      <span v-if="!initialRecipe">
        New recipe
      </span>
    </template>

    <template #default>
      Name:
      <input
          v-model="recipe.name"
          type="text"
      >
    </template>

    <template #modal-footer="{ ok, cancel, hide }">
      <b-button variant="primary" @click="confirmModal()" left>
        <span v-if="!!initialRecipe">
          Update
        </span>
        <span v-if="!initialRecipe">
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

export default {
  components: {},
  props: {
    modalShown: Boolean,
    initialRecipe: Object
  },
  emits: {
    'close-modal': null,
    'confirm-modal': null
  },
  data() {
    return {
      recipe: Object.assign({}, this.initialRecipe ) // Guard against undefined object and having to check for them. Also copy data.
    }
  },
  watch: {
    modalShown(newVal, oldVal) { // TODO - mixin ?
      if (newVal === true && newVal !== oldVal) {
        this.recipe = Object.assign({}, this.initialRecipe );
        this.$refs.modal.show();
      } else if (newVal === false && newVal !== oldVal) {
        this.$refs.modal.hide();
        // Clear data also when closing
        this.recipe = {};
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
      this.$emit('confirm-modal', this.recipe);
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  margin-right: 20px;
}

input {
  border: 1px solid #333333;
}
</style>