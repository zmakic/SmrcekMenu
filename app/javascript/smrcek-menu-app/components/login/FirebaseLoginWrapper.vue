<template>
  <div>
    <LoginForm
        :modal-shown="loginModalShown"
        @close-modal="closeLogin()"
        @confirm-modal="doLogin($event)"
    />
    <RegistrationForm
        :modal-shown="registrationModalShown"
        @close-modal="closeRegistration()"
        @confirm-modal="doRegistration($event)"
    />
    <MergeWithMailForm
        :modal-shown="mergeModalShown"
        @close-modal="closeMerge()"
        @confirm-modal="doMerge($event)"
    />
  </div>
</template>

<script lang="ts">

import { mapState } from "vuex";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import MergeWithMailForm from "./MergeWithMailForm";
import { LoginStateEnum } from "../../models/login/login-state-enum";
import { LoggedInUser } from "../../models/login/logged-in-user";

export default {
  components: {
    LoginForm,
    RegistrationForm,
    MergeWithMailForm
  },
  emits: {
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapState('LoggedInUserModule', {
      loginModalShown(state: LoggedInUser) { return state.loginState === LoginStateEnum.LOGIN_STARTED; },
      registrationModalShown(state: LoggedInUser) { return state.loginState === LoginStateEnum.REGISTRATION_STARTED; },
      mergeModalShown(state: LoggedInUser) {
        const isConflict = state.loginState === LoginStateEnum.LOGIN_CONFLICT;

        return isConflict;
      }
    })
  },
  mounted() {
  },
  methods: {
    doLogin(event: any) { // TODO - fix any
      this.$store.dispatch('LoggedInUserModule/loginUser', {
        loginType: event.loginType,
        email: event.email,
        password: event.password
      }).then(response => {

      }).catch(error => {
        console.log('login error', error);
      });
    },
    closeLogin() {
      this.$store.commit('LoggedInUserModule/quitLoggingIn');
    },

    doRegistration(event: any) { // TODO - fix any
      this.$store.dispatch('LoggedInUserModule/registerUser', {
        loginType: event.loginType,
        email: event.email,
        password: event.password
      });
    },
    closeRegistration() {
      this.$store.commit('LoggedInUserModule/quitRegistration');
    },

    doMerge(event: any) { // TODO - fix any
      this.$store.dispatch('LoggedInUserModule/finalizeConflictResolution', {
        loginType: event.loginType,
        email: event.email,
        password: event.password
      });
    },
    closeMerge() {
      this.$store.commit('LoggedInUserModule/quitConflictResolution');
    }
  },
};

</script>
