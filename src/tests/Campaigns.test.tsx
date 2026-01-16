import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Campaigns from "../pages/Campaigns";
import * as campaignApi from "../api/campaign.api";
import * as listApi from "../api/list.api";
import * as snackbarContext from "../context/SnackbarContext";

// Mock Child Components
vi.mock("../components/CreateCampaignForm", () => ({
  default: ({ onCreated }: any) => (
    <div data-testid="create-campaign-form">
      Create Campaign Form
      <button onClick={onCreated}>Trigger Created</button>
    </div>
  ),
}));

vi.mock("../components/CampaignCard", () => ({
  default: ({ campaign }: any) => (
    <div data-testid="campaign-card">{campaign.subject}</div>
  ),
}));

vi.mock("../components/SendCampaignPopup", () => ({
  default: () => <div data-testid="send-campaign-popup">Send Popup</div>,
}));

// Mock APIs
vi.mock("../api/campaign.api");
vi.mock("../api/list.api");

// Mock Context
vi.mock("../context/SnackbarContext", () => ({
  useSnackbar: vi.fn(),
}));

describe("Campaigns Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (snackbarContext.useSnackbar as any).mockReturnValue({
      showSnackbar: vi.fn(),
    });
  });

  /* -------------------------------------------------------------------------- */
  /* INITIAL RENDER                                                             */
  /* -------------------------------------------------------------------------- */
  it("renders page header and actions correctly", async () => {
    (campaignApi.getCampaigns as any).mockResolvedValue({ data: [] });
    (listApi.getLists as any).mockResolvedValue({ data: [] });

    render(<Campaigns />);

    expect(screen.getByText("Campaigns")).toBeInTheDocument();
    expect(
      screen.getByText("Manage and track your email broadcasts")
    ).toBeInTheDocument();
    expect(screen.getByText("New Campaign")).toBeInTheDocument();
  });

  /* -------------------------------------------------------------------------- */
  /* LOADING & EMPTY STATE                                                      */
  /* -------------------------------------------------------------------------- */
  it("shows loading indicator while fetching data", async () => {
    (campaignApi.getCampaigns as any).mockImplementation(
      () => new Promise(() => {})
    );
    (listApi.getLists as any).mockResolvedValue({ data: [] });

    render(<Campaigns />);
    // "Loading campaigns..." is the text displayed in the loading block
    expect(screen.getByText("Loading campaigns...")).toBeInTheDocument();
  });

  it("shows empty state when no campaigns exist", async () => {
    (campaignApi.getCampaigns as any).mockResolvedValue({ data: [] });
    (listApi.getLists as any).mockResolvedValue({ data: [] });

    render(<Campaigns />);

    await waitFor(() => {
      expect(
        screen.getByText("No campaigns found. Start by creating one!")
      ).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------- */
  /* DISPLAY DATA                                                               */
  /* -------------------------------------------------------------------------- */
  it("renders a list of campaigns", async () => {
    const mockCampaigns = [
      { id: "1", subject: "Cyber Monday Sale" },
      { id: "2", subject: "Weekly Digest" },
    ];
    (campaignApi.getCampaigns as any).mockResolvedValue({
      data: mockCampaigns,
    });
    (listApi.getLists as any).mockResolvedValue({ data: [] });

    render(<Campaigns />);

    await waitFor(() => {
      expect(screen.getByText("Cyber Monday Sale")).toBeInTheDocument();
      expect(screen.getByText("Weekly Digest")).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------- */
  /* INTERACTION                                                                */
  /* -------------------------------------------------------------------------- */
  it("toggles the create campaign form", async () => {
    (campaignApi.getCampaigns as any).mockResolvedValue({ data: [] });
    (listApi.getLists as any).mockResolvedValue({ data: [] });

    render(<Campaigns />);

    // Initially form is hidden
    expect(
      screen.queryByTestId("create-campaign-form")
    ).not.toBeInTheDocument();

    // Click "New Campaign"
    fireEvent.click(screen.getByText("New Campaign"));
    expect(screen.getByText("Cancel")).toBeInTheDocument(); // Button text changes
    expect(screen.getByTestId("create-campaign-form")).toBeInTheDocument();

    // Click "Cancel"
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.getByText("New Campaign")).toBeInTheDocument();
    expect(
      screen.queryByTestId("create-campaign-form")
    ).not.toBeInTheDocument();
  });

  it("refreshes data when refresh button is clicked", async () => {
    (campaignApi.getCampaigns as any).mockResolvedValue({ data: [] });
    (listApi.getLists as any).mockResolvedValue({ data: [] });

    render(<Campaigns />);

    // Find refresh button (by tooltip or icon presence, but we simply look for button role that isn't 'New Campaign')
    // Note: In our code, we added a Tooltip "Refresh Data"

    const refreshBtn = screen.getByRole("button", { name: /Refresh Data/i });
    fireEvent.click(refreshBtn);

    await waitFor(() => {
      expect(snackbarContext.useSnackbar().showSnackbar).toHaveBeenCalledWith(
        "Data synced",
        "success"
      );
    });
  });
});
