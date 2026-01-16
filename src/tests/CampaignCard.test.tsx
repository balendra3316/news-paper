import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CampaignCard from "../components/CampaignCard";
import * as campaignApi from "../api/campaign.api";
import * as snackbarContext from "../context/SnackbarContext";

// Mock API modules
vi.mock("../api/campaign.api");

// Mock Snackbar
vi.mock("../context/SnackbarContext", () => ({
  useSnackbar: vi.fn(),
}));

// Mock Template Editor to avoid complex rendering
vi.mock("../components/TemplateEditor", () => ({
  default: ({ value, onChange }: any) => (
    <input
      data-testid="template-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

describe("CampaignCard Component", () => {
  const mockCampaign = {
    id: "camp-1",
    subject: "Test Campaign",
    content: "<p>Hello World</p>",
    opened: 0,
    list: { id: "list-1", name: "Test List" },
  };

  const mockLists = [
    { id: "list-1", name: "Test List" },
    { id: "list-2", name: "Another List" },
  ];

  const mockProps = {
    campaign: mockCampaign,
    lists: mockLists,
    onUpdated: vi.fn(),
    onSend: vi.fn(),
    isEditingExternal: false,
    onEditStart: vi.fn(),
    onEditEnd: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (snackbarContext.useSnackbar as any).mockReturnValue({
      showSnackbar: vi.fn(),
    });
  });

  /* -------------------------------------------------------------------------- */
  /* RENDERING                                                                  */
  /* -------------------------------------------------------------------------- */
  it("renders campaign details in view mode", () => {
    render(<CampaignCard {...mockProps} />);

    expect(screen.getByText("Test Campaign")).toBeInTheDocument();
    // Use regex for loose matching or check specific element
    expect(screen.getByText("Test List")).toBeInTheDocument();
    expect(screen.getByText("DRAFT")).toBeInTheDocument();
    // Content is rendered unsafely, so we look for text inside
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  /* -------------------------------------------------------------------------- */
  /* EDIT MODE                                                                  */
  /* -------------------------------------------------------------------------- */
  it("switches to edit mode and shows form", () => {
    // We trigger edit mode internally via the Edit button
    render(<CampaignCard {...mockProps} />);

    const editBtn = screen.getByRole("button", { name: /Edit/i });
    fireEvent.click(editBtn);

    expect(screen.getByLabelText("Campaign Subject")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Campaign")).toBeInTheDocument();
    expect(screen.getByTestId("template-editor")).toBeInTheDocument();
    expect(mockProps.onEditStart).toHaveBeenCalled();
  });

  it("saves changes correctly", async () => {
    render(<CampaignCard {...mockProps} />);

    // Enter Edit Mode
    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));

    // Change Subject
    const subjectInput = screen.getByLabelText("Campaign Subject");
    fireEvent.change(subjectInput, { target: { value: "Updated Subject" } });

    // Save
    const saveBtn = screen.getByRole("button", { name: /Save/i });

    // Mock API success
    (campaignApi.updateCampaign as any).mockResolvedValue({});

    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(campaignApi.updateCampaign).toHaveBeenCalledWith("camp-1", {
        subject: "Updated Subject",
        content: "<p>Hello World</p>", // Unchanged
        listId: "list-1", // Existing list
      });
      expect(mockProps.onUpdated).toHaveBeenCalled();
    });
  });

  /* -------------------------------------------------------------------------- */
  /* ACTIONS                                                                    */
  /* -------------------------------------------------------------------------- */
  it("handles delete action", async () => {
    // Mock confirm
    window.confirm = vi.fn(() => true);
    (campaignApi.deleteCampaign as any).mockResolvedValue({});

    render(<CampaignCard {...mockProps} />);

    const deleteBtn = screen.getByLabelText("Delete Campaign");

    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();
    expect(campaignApi.deleteCampaign).toHaveBeenCalledWith("camp-1");
    await waitFor(() => {
      expect(mockProps.onUpdated).toHaveBeenCalled();
    });
  });
});
