<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand>
        <img :src="logoPath" />
        {{title}}
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown :text="user.uid ? displayNameParsed : 'User'" right>
          <b-dropdown-item v-if="!!user.uid">
            <b-button @click.stop="doLogout()" variant="light">
              Logout
            </b-button>
          </b-dropdown-item>
          <b-dropdown-item v-if="!user.uid"
              @click.stop="openLogin()">
              Login
          </b-dropdown-item>
          <b-dropdown-item v-if="!user.uid"
              @click.stop="openRegistration()">
              Register
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-button @click="exitApp()" variant="light">
          Exit
        </b-button>

      </b-navbar-nav>
    </b-navbar>
    <b-card>
      <div class="main-container" v-if="!user.uid">
        <p>Not logged in</p>
        <b-button @click="openLogin()" variant="primary">Login first</b-button>
      </div>
      <div class="main-container" v-if="!!user.uid">
        <div class="sidebar-section">
          <b-button-group vertical>
            <b-button @click.stop="showDashboard()" :variant="currentView === CurrentViewEnum.DASHBOARD ? 'success' : 'light'">Dashboard</b-button>
            <b-button @click.stop="showRecipes()" :variant="currentView === CurrentViewEnum.RECIPES ? 'success' : 'light'">Recipes</b-button>
            <b-button @click.stop="showIngredients()" :variant="currentView === CurrentViewEnum.INGREDIENTS ? 'success' : 'light'">Ingredients</b-button>
          </b-button-group>
        </div>
        <div class="content-section">
          <div
            v-if="currentView === CurrentViewEnum.NOTHING">
            O hoh, we should not have access this screen, something wrong in root component
          </div>
          <div
              v-if="currentView === CurrentViewEnum.DASHBOARD">
            DASHBOARD!
          </div>
          <div
              v-if="currentView === CurrentViewEnum.INGREDIENTS">
            INGREDIENTS!
          </div>
          <Recipes
              v-if="currentView === CurrentViewEnum.RECIPES"
              :recipesList="recipesList">
          </Recipes>
        </div>
      </div>

    </b-card>

    <FirebaseLoginWrapper />
  </div>
</template>

<script lang="ts">
import { mapState } from "vuex";
import FirebaseLoginWrapper from "./login/FirebaseLoginWrapper.vue";
import LoginButton from "./login/LoginButton.vue";
import {LoggedInUser} from "../models/login/logged-in-user";
import Recipes from "smrcek-menu-app/components/recipes/Recipes.vue";

enum CurrentViewEnum {
  NOTHING = 0,

  DASHBOARD = 1,

  RECIPES = 10,

  INGREDIENTS = 20
}

export default {
  components: { LoginButton, FirebaseLoginWrapper, Recipes },
  props: {
    title: String,
    rootPath: String,
    logoPath: String
  },
  computed: {
    ...mapState({
      appLoaded: 'appLoaded',
      recipesList: 'recipesList'
    }),
    ...mapState('LoggedInUserModule', {
      user(state: LoggedInUser) {
        return state;
      },
      displayNameParsed(state: LoggedInUser): string {
        return state.displayName ? state.displayName :
            state.email ? state.email : 'No Name';
      },
    })
  },
  data() {
    return {
      currentView: CurrentViewEnum.DASHBOARD,
      CurrentViewEnum: CurrentViewEnum
    }
  },
  methods: {
    showDashboard() {
      this.currentView = CurrentViewEnum.DASHBOARD;
    },
    showRecipes() {
      this.currentView = CurrentViewEnum.RECIPES;
      this.$store.dispatch("loadRecipes" ).then(recipes => {
        console.log('loaded recipes', recipes);
      });
    },
    showIngredients() {
      this.currentView = CurrentViewEnum.INGREDIENTS;
      this.$store.dispatch("loadIngredients").then(ingredients =>{
        console.log('loaded ingredients', ingredients);
      });
    },
    openLogin() {
      this.$store.commit("LoggedInUserModule/startLogin");
    },
    openRegistration() {
      this.$store.commit("LoggedInUserModule/startRegistration");
    },
    doLogout() {
      this.$store.dispatch("LoggedInUserModule/logout");
    },
    exitApp() {
      window.location.pathname = this.rootPath
    }
  },
  mounted() {
    this.$nextTick( () => {
      // Run after whole view is rendered
    })
  }
};
</script>

<style scoped>
.navbar-brand img {
  max-width: 64px;
  max-height: 64px;
}

.main-container {
  flex-direction: row;
  box-sizing: border-box;
  display: flex;
}

.sidebar-section {
  margin-right: 20px;
}

.sidebar-section button {
  margin-bottom: 20px;
}

.content-section {
}
</style>