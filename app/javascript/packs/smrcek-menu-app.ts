// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascripts and only use these pack files to reference
// that code so it'll be compiled.

import {Store} from "vuex";

require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")


// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)


// Just helper for typescript handling of injected store
// declare module '@vue/runtime-core' {
//     // provide typings for `this.$store`
//     interface ComponentCustomProperties {
//         $store: Store<any>
//     }
// }
import Vue from "vue";
import { SmrcekMenuAppStore } from "../smrcek-menu-app/store/smrcek-menu-app-store";
import SmrcekMenuApp from '../smrcek-menu-app/components/SmrcekMenuApp.vue'

import firebase from "firebase/app";
import { firebaseAuthProvider } from "services/firebase";

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)


const appTag = 'smrcek-menu-app';

document.addEventListener('turbolinks:load', () => {
    const appElements = document.getElementsByTagName(appTag);
    if (appElements && appElements.length === 1) {
        const appElement = appElements[0];

        console.log('dataset', ...(appElement as any).dataset);

        const app = new Vue({
            el: appTag,
            ...SmrcekMenuApp,
            store: SmrcekMenuAppStore,
            propsData: {
                ...(appElement as any).dataset // TODO - see what with this any ??
            }
        });


        /**
         * Connect firebase to app
         */
        firebaseAuthProvider.onAuthStateChanged((user: firebase.User | null) => {
            console.log('firebase user changed');
            if (!user) {
                SmrcekMenuAppStore.dispatch({
                    type: 'LoggedInUserModule/setUserFromFirebase',
                });
                return undefined;
            }

            // TODO - constants for actions
            SmrcekMenuAppStore.dispatch({
                type: 'LoggedInUserModule/setUserFromFirebase',
                ...user
            });
            return user;
        });
    }
});

