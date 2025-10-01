import { defineConfig } from "cypress";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // Set default running mode
      config.env.RUNNING_MODE =
        config.env.RUNNING_MODE || process.env.RUNNING_MODE || "UI";

      // General environment variables
      config.env = {
        ...config.env,
        ...process.env, // pull all keys from .env
      };

      // Load delay values for CLI and UI modes
      ["UI", "CLI"].forEach((mode) => {
        ["SHORT", "MEDIUM", "LONG"].forEach((level) => {
          const L_key = `DELAY_${mode}_${level}`;
          config.env[L_key] = process.env[L_key];
        });
      });

      // First fetch: Get test data
      const getTestData = await fetch(
        `${process.env.HOST_URL}/api/method/ai_test_pilot_handle_request?i_test_lab=${process.env.TEST_LAB}&i_action=get_test_data`,
        {
          headers: {
            Authorization: `${process.env.HOST_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const testData = await getTestData.json();

      config.env.FETCHED_TEST_RUN = testData.message.test_run.name;
      config.env.FETCHED_MASTER_DATA = testData.message.master_data;
      config.env.FETCHED_LOGIN_DATA = testData.message.login_data;

      // Second fetch: Get test lab details
      const getTestLab = await fetch(
        `${process.env.HOST_URL}/api/method/ai_test_pilot_handle_request?i_test_lab=${process.env.TEST_LAB}&i_action=get_test_lab`,
        {
          headers: {
            Authorization: `${process.env.HOST_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const testLabData = await getTestLab.json();

      config.env.FETCHED_TEST_LAB = testLabData.message.test_lab;

      return config;
    },
  },
});
