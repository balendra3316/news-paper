// /// <reference types="vitest" />
// import { defineConfig } from "vitest/config";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   test: {
//     globals: true,
//     environment: "jsdom",
//     setupFiles: "./src/setupTests.ts", // We will create this next
//   },
// });

/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.tsx",
    // ADD THIS SECTION:
    deps: {
      optimizer: {
        web: {
          include: ["@mui/icons-material"],
        },
      },
    },
    // AND THIS:
    alias: {
      // This forces vitest to use the main entry point rather than individual files
      "@mui/icons-material": "@mui/icons-material/index.js",
    },
  },
});
