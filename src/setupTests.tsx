// import { expect, afterEach } from "vitest";
// import { cleanup } from "@testing-library/react";
// import * as matchers from "@testing-library/jest-dom/matchers";
// import "@testing-library/jest-dom";

// // Extend Vitest's expect with jest-dom matchers
// expect.extend(matchers);

// // Cleanup after each test case (e.g., clearing jsdom)
// afterEach(() => {
//   cleanup();
// });

import { expect, afterEach, vi } from "vitest";
import React from "react";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import "@testing-library/jest-dom";

expect.extend(matchers);

// MOCK ALL MUI ICONS: This stops Vitest from opening thousands of icon files
vi.mock("@mui/icons-material", () => {
  return new Proxy(
    {},
    {
      get: (prop) => {
        // Returns a dummy component for any icon requested
        return () =>
          React.createElement("div", { "data-testid": `icon-${String(prop)}` });
      },
    }
  );
});

afterEach(() => {
  cleanup();
});
