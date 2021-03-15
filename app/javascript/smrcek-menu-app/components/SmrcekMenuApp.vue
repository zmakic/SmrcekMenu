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
            <b-button @click.stop="showMenuInTime()" :variant="currentView === CurrentViewEnum.MENU_IN_TIME ? 'success' : 'light'">Time Menu</b-button>
            <b-button @click.stop="showRecipes()" :variant="currentView === CurrentViewEnum.RECIPES ? 'success' : 'light'">Recipes</b-button>
            <b-button @click.stop="showIngredients()" :variant="currentView === CurrentViewEnum.INGREDIENTS ? 'success' : 'light'">Ingredients</b-button>
          </b-button-group>
        </div>
        <div class="content-section">
          <div
            v-if="currentView === CurrentViewEnum.NOTHING">
            O hoh, we should not have access this screen, something wrong in root component
          </div>
          <Dashboard
              v-if="currentView === CurrentViewEnum.DASHBOARD">
          </Dashboard>
          <div
              v-if="currentView === CurrentViewEnum.MENU_IN_TIME">
            In progress - menu for time periods
          </div>
          <Ingredients
              v-if="currentView === CurrentViewEnum.INGREDIENTS"
              :ingredientsList="ingredientsList">
          </Ingredients>
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
import Recipes from "../components/recipes/Recipes.vue";
import Dashboard from "../components/dashboard/Dashboard.vue";
import Ingredients from "../components/ingredients/Ingredients.vue";

enum CurrentViewEnum {
  NOTHING = 0,

  DASHBOARD = 1,

  RECIPES = 10,

  INGREDIENTS = 20,

  MENU_IN_TIME = 30
}

export default {
  components: {Dashboard, LoginButton, FirebaseLoginWrapper, Recipes, Ingredients },
  props: {
    title: String,
    rootPath: String,
    logoPath: String
  },
  computed: {
    ...mapState({
      appLoaded: 'appLoaded',
      recipesList: 'recipesList',
      ingredientsList: 'ingredientsList'
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
      this.$store.dispatch("loadRecipes" ).then(recipes => {});
    },
    showIngredients() {
      this.currentView = CurrentViewEnum.INGREDIENTS;
      this.$store.dispatch("loadIngredients").then(ingredients =>{});
    },
    showMenuInTime() {
      this.currentView = CurrentViewEnum.MENU_IN_TIME;
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