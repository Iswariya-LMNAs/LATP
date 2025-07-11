import { defineConfig } from "cypress";
import * as dotenv from "dotenv";
dotenv.config();                          // Load variables from .env
export default defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // Set default running mode
      config.env.RUNNING_MODE = config.env.RUNNING_MODE || process.env.RUNNING_MODE || "UI";
      // General environment variables
      config.env = {
        ...config.env,
        ...process.env, // ✅ pull all keys from .env
      };
      // Load delay values for CLI and UI modes
      ["UI", "CLI"].forEach(mode => {
        ["SHORT", "MEDIUM", "LONG"].forEach(level => {
          const L_key = `DELAY_${mode}_${level}`;
          config.env[L_key] = process.env[L_key];
        });
      });
      // Register tasks
      on("task", {
        fetchtestscript: async () => {
          const response = await fetch(
            `${process.env.HOST_URL}/api/method/ai_test_pilot_handle_request?i_test_lab=${process.env.TEST_LAB}&i_action=get_test_data`,
            {
              headers: {
                Authorization: `${process.env.HOST_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          return result;
        },
        fetchtestLab: async () => {
          const response = await fetch(
            `${process.env.HOST_URL}/api/method/ai_test_pilot_handle_request?i_test_lab=${process.env.TEST_LAB}&i_action=get_test_lab`,
            {
              headers: {
                Authorization: `${process.env.HOST_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          return result;
        },
      });

      // Prefetch and attach to env
      const res = await fetch(
        `${process.env.HOST_URL}/api/method/ai_test_pilot_handle_request?i_test_lab=${process.env.TEST_LAB}&i_action=get_test_data`,
        {
          headers: {
            Authorization: `${process.env.HOST_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      config.env.FETCHED_TEST_RUN = data.message.test_run.name;
      config.env.FETCHED_MASTER_DATA = data.message.master_data;

      return config;
    },
  },
});