import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Subscribers from "../pages/Subscribers";
import * as subscriberApi from "../api/subscriber.api";
import * as listApi from "../api/list.api";
import * as snackbarContext from "../context/SnackbarContext";

// Mock the API modules
vi.mock("../api/subscriber.api");
vi.mock("../api/list.api");

// Mock useSnackbar hook
vi.mock("../context/SnackbarContext", () => ({
  useSnackbar: vi.fn(),
}));

describe("Subscribers Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (snackbarContext.useSnackbar as any).mockReturnValue({
      showSnackbar: vi.fn(),
    });
  });

  it("should render the subscribers page title and add button", async () => {
    // Mock APIs to return empty data keys
    (subscriberApi.getSubscribers as any).mockResolvedValue({ data: [] });
    (listApi.getLists as any).mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <Subscribers />
      </BrowserRouter>
    );

    expect(screen.getByText("Subscribers")).toBeInTheDocument();
    expect(
      screen.getByText("View and segment your audience.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Subscriber/i })
    ).toBeInTheDocument();

    // Wait for the async data fetch to complete to avoid "act" warnings
    await waitFor(() => {
      expect(screen.getByText("No subscribers found.")).toBeInTheDocument();
    });
  });

  it("should display subscribers when api returns data", async () => {
    const mockSubscribers = [
      {
        id: "1",
        email: "test1@example.com",
        customFields: { role: "developer" },
        createdAt: "2023-01-01T10:00:00Z",
      },
      {
        id: "2",
        email: "test2@example.com",
        customFields: {},
        createdAt: "2023-01-02T10:00:00Z",
      },
    ];

    (subscriberApi.getSubscribers as any).mockResolvedValue({
      data: mockSubscribers,
    });
    (listApi.getLists as any).mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <Subscribers />
      </BrowserRouter>
    );

    // Wait for the data to be loaded and rendered in cards
    await waitFor(() => {
      expect(screen.getByText("test1@example.com")).toBeInTheDocument();
      expect(screen.getByText("test2@example.com")).toBeInTheDocument();
    });
  });

  it("should show empty state when no subscribers found", async () => {
    (subscriberApi.getSubscribers as any).mockResolvedValue({ data: [] });
    (listApi.getLists as any).mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <Subscribers />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No subscribers found.")).toBeInTheDocument();
    });
  });

  it("should toggle create subscriber form visibility", async () => {
    (subscriberApi.getSubscribers as any).mockResolvedValue({ data: [] });
    (listApi.getLists as any).mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <Subscribers />
      </BrowserRouter>
    );

    // Wait for initial load to settle
    await waitFor(() => {
      expect(screen.getByText("No subscribers found.")).toBeInTheDocument();
    });

    const addButton = screen.getByRole("button", { name: /Add Subscriber/i });

    // Initial state: Add Subscriber button is visible, form usually not (lazy loaded)
    expect(addButton).toBeInTheDocument();

    // Click to show form
    await userEvent.click(addButton);

    // The button text changes to "Cancel"
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Cancel/i })
      ).toBeInTheDocument();
    });

    // Click cancel to hide form
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Add Subscriber/i })
      ).toBeInTheDocument();
    });
  });
});
