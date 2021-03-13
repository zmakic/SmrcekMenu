// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

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

// TODO - import Vue from 'vue' - should be this, and esm for dev only
import { createApp } from 'vue';
import SmrcekMenuApp from '../components/SmrcekMenuApp.vue'

const appTag = 'smrcek-menu-app';

document.addEventListener('turbolinks:load', () => {
  const appElements = document.getElementsByTagName(appTag);
  if (appElements && appElements.length === 1) {
    const appElement = appElements[0];
    const app = createApp(SmrcekMenuApp, {
      ...appElement.dataset
    });
    app.mount(appTag);

    console.log('APP STARTED');
  }
});
