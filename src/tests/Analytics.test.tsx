import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Analytics from "../pages/Analytics";
import * as campaignApi from "../api/campaign.api";
import * as snackbarContext from "../context/SnackbarContext";

// Mock Child Components to be simple strings
vi.mock("../components/analytics/CampaignSummary", () => ({
  default: () => <div data-testid="campaign-summary">Campaign Summary</div>,
}));
vi.mock("../components/analytics/GeoChart", () => ({
  default: () => <div data-testid="geo-chart">Geo Chart</div>,
}));
vi.mock("../components/analytics/DeviceChart", () => ({
  default: () => <div data-testid="device-chart">Device Chart</div>,
}));
vi.mock("../components/analytics/TimelineChart", () => ({
  default: () => <div data-testid="timeline-chart">Timeline Chart</div>,
}));
vi.mock("../components/analytics/LinksTable", () => ({
  default: () => <div data-testid="links-table">Links Table</div>,
}));

// Mock APIs
vi.mock("../api/campaign.api");

// Mock useSnackbar
vi.mock("../context/SnackbarContext", () => ({
  useSnackbar: vi.fn(),
}));

describe("Analytics Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (snackbarContext.useSnackbar as any).mockReturnValue({
      showSnackbar: vi.fn(),
    });
  });

  /* -------------------------------------------------------------------------- */
  /* LOADING STATE                                                              */
  /* -------------------------------------------------------------------------- */
  it("shows skeleton while loading campaigns", async () => {
    (campaignApi.getCampaigns as any).mockImplementation(
      () => new Promise(() => {})
    );

    render(<Analytics />);

    expect(
      screen.queryByText("No campaigns found for analysis.")
    ).not.toBeInTheDocument();
  });

  /* -------------------------------------------------------------------------- */
  /* EMPTY STATE                                                                */
  /* -------------------------------------------------------------------------- */
  it("shows empty state when no campaigns are returned", async () => {
    (campaignApi.getCampaigns as any).mockResolvedValue({ data: [] });

    render(<Analytics />);

    await waitFor(() => {
      expect(
        screen.getByText("No campaigns found for analysis.")
      ).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------- */
  /* RENDERING WITH DATA                                                        */
  /* -------------------------------------------------------------------------- */
  it("renders charts and summary when campaigns are present", async () => {
    const mockCampaigns = [
      { id: "1", subject: "Welcome Email" },
      { id: "2", subject: "Weekly Newsletter" },
    ];
    (campaignApi.getCampaigns as any).mockResolvedValue({
      data: mockCampaigns,
    });

    render(<Analytics />);

    // Wait for the main title
    await waitFor(() => {
      expect(screen.getByText("Campaign Analytics")).toBeInTheDocument();
    });

    expect(screen.getByText("Welcome Email")).toBeInTheDocument();

    // Check that child components are rendered
    await waitFor(() => {
      expect(screen.getByTestId("campaign-summary")).toBeInTheDocument();
      expect(screen.getByTestId("geo-chart")).toBeInTheDocument();
      expect(screen.getByTestId("device-chart")).toBeInTheDocument();
      expect(screen.getByTestId("timeline-chart")).toBeInTheDocument();
      expect(screen.getByTestId("links-table")).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------- */
  /* INTERACTION                                                                */
  /* -------------------------------------------------------------------------- */
  it("updates analytics when a different campaign is selected", async () => {
    const mockCampaigns = [
      { id: "1", subject: "Welcome Email" },
      { id: "2", subject: "Weekly Newsletter" },
    ];
    (campaignApi.getCampaigns as any).mockResolvedValue({
      data: mockCampaigns,
    });

    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText("Campaign Analytics")).toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getByLabelText("Select Campaign"));

    // Click option 2
    const option2 = await screen.findByText("Weekly Newsletter");
    fireEvent.click(option2);

    // Now "Weekly Newsletter" should be displayed in the select box
    // And snackbar should be called
    await waitFor(() => {
      expect(snackbarContext.useSnackbar().showSnackbar).toHaveBeenCalledWith(
        "Analytics updated",
        "info"
      );
    });
  });
});
