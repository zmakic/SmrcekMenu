<template>
  <Modal 
    :modal-shown="modalShown" 
    title="Registration"
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

      Repeat Password:
      <input 
        v-model="repeatPassword"
        type="password" 
      >
      <br>
    </template>

    <template #actions>
      <button @click="confirmModal(LOGIN_TYPE.EMAIL)">
        Register
      </button>
    </template>
  </Modal>
</template>

<script lang="ts">

import Modal from "../modals/Modal";
import {LoginTypeEnum} from "../../models/login/login-type-enum";

export default {
  name: "RegistrationForm",
  components: {
    Modal
  },
  props: {
    modalShown: Boolean,
  },
  emits: {
    'close-modal': null,
    'confirm-modal': null
  },
  data() {
    return {
      email: null,
      password: null,
      repeatPassword: null,
      LOGIN_TYPE: LoginTypeEnum
    }
  },
  mounted() {
  },
  methods: {
    closeModal() {
      this.$emit('close-modal');
    },

    confirmModal(loginType: LoginTypeEnum) {
      var self = this;

      // TODO - check password vs repepeated password

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