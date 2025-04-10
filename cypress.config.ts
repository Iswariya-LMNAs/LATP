import { defineConfig } from "cypress";
import fetchData from "./src/fetchdata";
import * as dotenv from "dotenv";

dotenv.config(); // Load variables from .env

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Set default running mode
      config.env.RUNNING_MODE = config.env.RUNNING_MODE || process.env.RUNNING_MODE || "UI";

      // General environment variables
      config.env.TARGET_URL = process.env.TARGET_URL;
      config.env.LOGIN_EMAIL = process.env.LOGIN_EMAIL;
      config.env.LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;
      config.env.TARGET_PATH = process.env.TARGET_PATH;

      // Load delay values for CLI and UI modes
      ["UI", "CLI"].forEach(mode => {
        ["SHORT", "MEDIUM", "LONG"].forEach(level => {
          const L_key = `DELAY_${mode}_${level}`;
          config.env[L_key] = process.env[L_key];
        });
      });

      // Define custom Cypress tasks
      on("task", {
        async fetchData() {
          return await fetchData();
        },
      });
    return config; // Return updated config
    },
  },
});




