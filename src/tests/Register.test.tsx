import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Register from "../pages/Register";
import * as authApi from "../api/auth.api";
import { SnackbarProvider } from "../context/SnackbarContext";

// Mock the API
vi.mock("../api/auth.api", () => ({
  registerApi: vi.fn(),
}));

// Mock Navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("Register Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPage = () =>
    render(
      <BrowserRouter>
        <SnackbarProvider>
          <Register />
        </SnackbarProvider>
      </BrowserRouter>
    );

  it("should show validation errors when fields are empty", async () => {
    renderPage();

    const submitButton = screen.getByRole("button", {
      name: /Create Account/i,
    });

    await userEvent.click(submitButton);

    // FIX: Using ^ and $ anchors to ensure exact matches.
    // This prevents "Name is required" from matching "Organization name is required".
    expect(await screen.findByText(/^Name is required$/i)).toBeInTheDocument();

    expect(
      await screen.findByText(/Invalid email address/i)
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/^Organization name is required$/i)
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/Password must be at least 6 characters/i)
    ).toBeInTheDocument();
  });

  it("should call registerApi with correct data and navigate to login", async () => {
    (authApi.registerApi as any).mockResolvedValue({ data: { success: true } });

    renderPage();

    await userEvent.type(screen.getByLabelText(/Full Name/i), "John Doe");
    await userEvent.type(
      screen.getByLabelText(/Email Address/i),
      "test@example.com"
    );
    await userEvent.type(
      screen.getByLabelText(/Organization Name/i),
      "My Company"
    );
    await userEvent.type(screen.getByLabelText(/Password/i), "password123");

    await userEvent.click(
      screen.getByRole("button", { name: /Create Account/i })
    );

    await waitFor(() => {
      expect(authApi.registerApi).toHaveBeenCalledWith({
        fullName: "John Doe",
        email: "test@example.com",
        organizationName: "My Company",
        password: "password123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});

// npx vitest src/tests/Register.test.tsx --run
