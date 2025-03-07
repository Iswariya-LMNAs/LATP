import { defineConfig } from "cypress";
import fetchData from "./src/fetchdata";
import * as dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Pass environment variables to Cypress
      config.env.URL = process.env.URL;
      config.env.KEY = process.env.KEY;
      config.env.DOCTYPE = process.env.DOCTYPE;

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





