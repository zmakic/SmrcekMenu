<template>
  <b-modal
    ref="modal"
    @hide="closeModal($event)"
    @close="closeModal($event)">
    <template #modal-title>
      Login
    </template>

    <template #default>
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

    <template #modal-footer="{ ok, cancel, hide }">
      <b-button variant="primary" @click="confirmModal(LOGIN_TYPE.EMAIL)" left>
        Login with email
      </b-button>

      OR

      <b-button variant="primary"
        @click.stop="confirmModal(LOGIN_TYPE.FACEBOOK)"
      >
        FB 
      </b-button>
      <b-button variant="primary"
        @click.stop="confirmModal(LOGIN_TYPE.GOOGLE)"
      >
        Google
      </b-button>
    </template>
<!--  </Modal>-->
  </b-modal>
</template>

<script lang="ts">

import {LoginTypeEnum} from "smrcek-menu-app/models/login/login-type-enum";

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
      email: undefined,
      password: undefined,
      LOGIN_TYPE: LoginTypeEnum
    }
  },
  watch: {
    modalShown(newVal, oldVal) {
      console.log('modalshown', oldVal, newVal);
      if (newVal === true && newVal !== oldVal) {
        this.$refs.modal.show();
      } else if (newVal === false && newVal !== oldVal) {
        this.$refs.modal.hide();
        // Clear data also when closing
        this.email = undefined;
        this.password = undefined;
      }
    }
  },
  mounted() {
  },
  methods: {
    closeModal() {
      this.$emit('close-modal');
    },

    confirmModal(loginType: LoginTypeEnum) {
      const self = this;

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