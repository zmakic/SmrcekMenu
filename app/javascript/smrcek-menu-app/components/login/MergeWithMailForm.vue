<template>
  <Modal 
    :modal-shown="modalShown" 
    title="Merge account with {todo add provider}"
    @close-modal="closeModal"
  >
    <template #content>
      Email:
      <input 
        v-model="email"
        type="text"          
      >
      <br>

      Password:
      <input 
        v-model="password"
        type="password" 
      >
      <br>
    </template>

    <template #actions>
      <div @click="confirmModal(LOGIN_TYPE.EMAIL)">
        Merge accounts
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">

import Modal from "../modals/Modal";
import {LoginTypeEnum} from "smrcek-menu-app/models/login/login-type-enum";

export default {
  name: "MergeWithMailForm",
  components: {
    Modal
  },
  props: {
    modalShown: Boolean
  },
  emits: {
    'close-modal': null,
    'confirm-modal': null
  },  
  data() {
    return {
      email: null,
      password: null,
      LOGIN_TYPE: LoginTypeEnum // Here defined so we can use it in view
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    closeModal() {
      this.$emit('close-modal');
    },
    confirmModal(loginType: LoginTypeEnum) {
      var self = this;

      if (loginType === LoginTypeEnum.EMAIL) {
        if (!self.email) {
          console.log('no email');
          // Write message that email is required
          return;
        }

        if (!self.password) {
          console.log('no password');
          // Write message that password is required
          return;
        }
      }
      
      this.$emit('confirm-modal', {
        loginType: loginType,
        email: self.email, 
        password: self.password
      });
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