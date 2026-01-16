import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import * as campaignApi from "../api/campaign.api";
import * as listApi from "../api/list.api";
import * as subscriberApi from "../api/subscriber.api";
import * as authContext from "../context/AuthContext";

// Mock child components to be simple (shallow rendering concept)
vi.mock("../components/dashboard/StatCard", () => ({
  default: ({ title, value, loading, onClick }: any) => (
    <div data-testid="stat-card" onClick={onClick}>
      {loading ? "Loading..." : `${title}: ${value}`}
    </div>
  ),
}));

vi.mock("../components/dashboard/ActionCard", () => ({
  default: ({ title, description, onClick }: any) => (
    <div data-testid="action-card" onClick={onClick}>
      {title} - {description}
    </div>
  ),
}));

// Mock APIs
vi.mock("../api/campaign.api");
vi.mock("../api/list.api");
vi.mock("../api/subscriber.api");

// Mock Auth Context
vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children }: any) => <a>{children}</a>,
}));

describe("Dashboard Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (authContext.useAuth as any).mockReturnValue({
      user: { email: "admin@example.com" },
    });
  });

  /* -------------------------------------------------------------------------- */
  /* INITIAL RENDER                                                             */
  /* -------------------------------------------------------------------------- */
  it("renders the welcome message", async () => {
    // Setup empty data returns
    (campaignApi.getCampaigns as any).mockResolvedValue({ data: [] });
    (listApi.getLists as any).mockResolvedValue({ data: [] });
    (subscriberApi.getSubscribers as any).mockResolvedValue({ data: [] });

    render(<Dashboard />);

    // Check for welcome text (email is admin@example.com)
    expect(screen.getByText(/Welcome back,/i)).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument(); // split by @
  });

  /* -------------------------------------------------------------------------- */
  /* STATISTICS DISPLAY                                                         */
  /* -------------------------------------------------------------------------- */
  it("renders statistics correctly", async () => {
    // Mock Data
    (campaignApi.getCampaigns as any).mockResolvedValue({
      data: [
        { id: "1", opened: 10 },
        { id: "2", opened: 0 },
      ], // 2 campaigns, 1 sent (opened > 0 logic in component)
    });
    (listApi.getLists as any).mockResolvedValue({
      data: [{ id: "1" }, { id: "2" }, { id: "3" }],
    }); // 3 lists
    (subscriberApi.getSubscribers as any).mockResolvedValue({
      data: [{ id: "1" }],
    }); // 1 subscriber

    render(<Dashboard />);

    // Wait for the data to populate
    await waitFor(() => {
      // Logic: Total Campaigns: 2
      expect(screen.getByText("Total Campaigns: 2")).toBeInTheDocument();
      // Logic: Sent Successfully: 1 (where opened > 0)
      expect(screen.getByText("Sent Successfully: 1")).toBeInTheDocument();
      // Logic: Active Lists: 3
      expect(screen.getByText("Active Lists: 3")).toBeInTheDocument();
      // Logic: Subscribers: 1
      expect(screen.getByText("Subscribers: 1")).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------- */
  /* NAVIGATION INTERACTION                                                     */
  /* -------------------------------------------------------------------------- */
  it("navigates on quick action click", async () => {
    (campaignApi.getCampaigns as any).mockResolvedValue({ data: [] });
    (listApi.getLists as any).mockResolvedValue({ data: [] });
    (subscriberApi.getSubscribers as any).mockResolvedValue({ data: [] });

    render(<Dashboard />);

    // Click "Create Campaign"
    const createCampaignCard = screen.getByText(/Create Campaign/i);
    fireEvent.click(createCampaignCard);

    expect(mockNavigate).toHaveBeenCalledWith("/campaigns");
  });
});
