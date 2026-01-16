import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Lists from "../pages/Lists";
import * as listApi from "../api/list.api";
import * as authContext from "../context/AuthContext";
import * as snackbarContext from "../context/SnackbarContext";

// Mock APIs
vi.mock("../api/list.api");

// Mock Auth Context
vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock Snackbar Context
vi.mock("../context/SnackbarContext", () => ({
  useSnackbar: vi.fn(),
}));

describe("Lists Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (authContext.useAuth as any).mockReturnValue({
      user: { organizationID: "org-123" },
    });
    (snackbarContext.useSnackbar as any).mockReturnValue({
      showSnackbar: vi.fn(),
    });
  });

  /* -------------------------------------------------------------------------- */
  /* INITIAL RENDER                                                             */
  /* -------------------------------------------------------------------------- */
  it("renders header and create button", async () => {
    (listApi.getLists as any).mockResolvedValue({ data: [] });

    render(<Lists />);

    expect(screen.getByText("Segments")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create Segment/i })
    ).toBeInTheDocument();
  });

  /* -------------------------------------------------------------------------- */
  /* LIST RENDERING                                                             */
  /* -------------------------------------------------------------------------- */
  it("renders fetched lists", async () => {
    const mockLists = [
      {
        id: "1",
        name: "VIP Users",
        customFields: {},
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Inactive Users",
        customFields: { status: "inactive" },
        createdAt: new Date().toISOString(),
      },
    ];
    (listApi.getLists as any).mockResolvedValue({ data: mockLists });

    render(<Lists />);

    await waitFor(() => {
      expect(screen.getByText("VIP Users")).toBeInTheDocument();
      expect(screen.getByText("Inactive Users")).toBeInTheDocument();
      expect(screen.getByText("0 Rules")).toBeInTheDocument();
      expect(screen.getByText("1 Rules")).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------- */
  /* CREATION FLOW                                                              */
  /* -------------------------------------------------------------------------- */
  it("allows creating a new segment", async () => {
    (listApi.getLists as any).mockResolvedValue({ data: [] });
    // Simulate successful creation
    (listApi.createList as any).mockResolvedValue({
      data: { id: "3", name: "New List" },
    });

    render(<Lists />);

    // Open form
    fireEvent.click(screen.getByRole("button", { name: /Create Segment/i }));
    expect(
      screen.getByPlaceholderText("e.g. London Subscribers")
    ).toBeInTheDocument();

    // Type name
    const input = screen.getByPlaceholderText("e.g. London Subscribers");
    fireEvent.change(input, { target: { value: "New Segment" } });

    // Submit
    const createBtn = screen.getByRole("button", { name: "Create" });
    fireEvent.click(createBtn);

    await waitFor(() => {
      // API called
      expect(listApi.createList).toHaveBeenCalledWith({
        name: "New Segment",
        organizationId: "org-123",
      });
      // Snackbar shown
      expect(snackbarContext.useSnackbar().showSnackbar).toHaveBeenCalledWith(
        "Segment created successfully",
        "success"
      );
      // Form closed (Create button is visible again implies this, or check absence of input)
      expect(
        screen.queryByPlaceholderText("e.g. London Subscribers")
      ).not.toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------- */
  /* ACCORDION INTERACTION                                                      */
  /* -------------------------------------------------------------------------- */
  it("expands a list detail when clicked", async () => {
    const mockLists = [
      {
        id: "1",
        name: "Test List",
        customFields: { city: "London" },
        createdAt: new Date().toISOString(),
      },
    ];
    (listApi.getLists as any).mockResolvedValue({ data: mockLists });

    render(<Lists />);

    // Wait for list to appear
    await waitFor(() =>
      expect(screen.getByText("Test List")).toBeInTheDocument()
    );

    // Initially details are hidden
    // Accordion details are typically hidden or not rendered.
    // Let's click the summary.
    fireEvent.click(screen.getByText("Test List"));

    await waitFor(() => {
      expect(screen.getByText("General Info")).toBeInTheDocument(); // Inside details
      expect(screen.getByText("London")).toBeInTheDocument(); // The rule value
    });
  });
});
