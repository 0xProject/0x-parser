import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: ["examples/**"],
    },
  },
});
