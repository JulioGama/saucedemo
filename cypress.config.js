const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 880,
  viewportWidth: 1280,
  e2e: {
    setupNodeEvents(on, config) {},
    env: {
      "username": "standard_user",
      "password": "secret_sauce"
    }
  }, 
});
