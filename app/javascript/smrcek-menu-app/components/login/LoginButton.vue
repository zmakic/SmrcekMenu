<template>  
  <!-- div back to button, with submit disabled -->
  <b-button
    v-if="!userUid"
    @click.stop="doLogin()"
    >
    Login
  </b-button>
</template>

<script lang="ts">
export default {
  name: "LoginButton",
  components: {
  },
  props: {
    userUid: String,
    displayName: String,
    email: String
  },
  emits: {
    'login-triggered': null
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    doLogin: function() {
      this.$emit('login-triggered');
    }
  },
};

</script>
