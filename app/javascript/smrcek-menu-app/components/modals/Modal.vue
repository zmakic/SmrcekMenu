<template>
  <div 
    v-if="modalShown" 
    class="modal"
  >
    <div class="modal-overlay" />
    
    <div class="modal-content-container">
      <div 
        class="modal-close-icon"
        @click="closeModal()"
      >
        X
      </div>
      <div class="modal-title">
        {{ title }}
      </div>
      <div class="modal-content">
        <slot name="content" />
      </div>
      <div class="modal-actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">

export default {
  name: "Modal",
  components: {
  },
  props: {
    modalShown: Boolean,
    title: {
      type: String,
      default: undefined
    }
  },
  emits: {
    'close-modal': null
  },  
  data() {
    return {

    }
  },
  mounted() {
  },
  updated() {
    document.querySelector("body")?.classList.add("overflow-hidden");
  },
  beforeUnmount() {
    document.querySelector("body")?.classList.remove("overflow-hidden");
  },
  methods: {
    closeModal: function() {
      this.$emit('close-modal', null);
    },
  }
};

</script>

<style lang="scss" scoped>
.modal {
  overflow: hidden;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;

  display: flex;
  align-items: start;
  justify-content: center;

  .modal-overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(10, 10, 10, 0.3);
    z-index: 1;
  }

  .modal-content-container {
    background: #FEFEFE;
    border-radius: 5px;
    z-index: 2;
    margin-top: 200px;
    padding: 20px 20px 20px 20px;
    position: relative;

    .modal-close-icon {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 3;
      cursor: pointer;
    }

    .modal-title {
        margin-bottom: 20px;
    }

    .modal-content {
        position: relative;
        z-index: 3;
        max-width: 600px;
        margin-bottom: 20px;
    }

    .modal-actions {

    }
  }
}
</style>