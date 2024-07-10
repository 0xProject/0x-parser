import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 10000,
    coverage: {
      exclude: ["examples/**"],
    },
  },
});
