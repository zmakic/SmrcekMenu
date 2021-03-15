<template>
  <b-modal
      ref="modal"
      @hide="closeModal($event)"
      @close="closeModal($event)">
    <template #modal-title>
      New recipe
    </template>

    <template #default>
      Name:
      <input
          v-model="name"
          type="text"
      >
    </template>

    <template #modal-footer="{ ok, cancel, hide }">
      <b-button variant="primary" @click="confirmModal()" left>
        Create
      </b-button>
      <b-button @click="closeModal()">
        Cancel
      </b-button>
    </template>
    <!--  </Modal>-->
  </b-modal>
</template>

<script lang="ts">

import {RecipeDto} from "smrcek-menu-app/models/backend/recipe-dto";

export default {
  components: {},
  props: {
    modalShown: Boolean
  },
  emits: {
    'close-modal': null,
    'confirm-modal': null
  },
  data() {
    return {
      name: undefined
    } as RecipeDto
  },
  watch: {
    modalShown(newVal, oldVal) { // TODO - mixin ?
      if (newVal === true && newVal !== oldVal) {
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
      this.$emit('confirm-modal', {
        name: this.name
      } as RecipeDto);
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