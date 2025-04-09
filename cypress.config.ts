import { defineConfig } from "cypress";
import fetchData from "./src/fetchdata";
import * as dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env.RUNNING_MODE = config.env.RUNNING_MODE || "UI";
      // Pass environment variables to Cypress
      config.env.TARGET_URL = process.env.TARGET_URL;
      config.env.LOGIN_EMAIL = process.env.LOGIN_EMAIL;
      config.env.LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;
      config.env.TARGET_PATH = process.env.TARGET_PATH;
      config.env.TARGET_PATH = process.env.TARGET_PATH;
     
      // config.env.DOCTYPE = process.env.DOCTYPE;

      
      // Define Cypress tasks
      on("task", {
        async fetchData() {
        return await fetchData();
        },
      });      
      return config; // Ensure modified config is returned
    },
  },
});





