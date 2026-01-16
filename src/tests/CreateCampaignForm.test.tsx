import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateCampaignForm from "../components/CreateCampaignForm";
import * as campaignApi from "../api/campaign.api";

// Mock API
vi.mock("../api/campaign.api");

describe("CreateCampaignForm Component", () => {
  it("renders the form fields", () => {
    render(<CreateCampaignForm onCreated={vi.fn()} />);

    expect(screen.getByLabelText(/Email Subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Content/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create Campaign/i })
    ).toBeInTheDocument();
  });

  it("displays validation errors for empty submission", async () => {
    render(<CreateCampaignForm onCreated={vi.fn()} />);

    const submitBtn = screen.getByRole("button", { name: /Create Campaign/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Subject must be at least 5 characters")
      ).toBeInTheDocument();
      expect(screen.getByText("Content is too short")).toBeInTheDocument();
    });
  });

  it("submits the form successfully with valid data", async () => {
    const onCreatedMock = vi.fn();
    (campaignApi.createCampaign as any).mockResolvedValue({});

    render(<CreateCampaignForm onCreated={onCreatedMock} />);

    // Fill valid data
    const subjectInput = screen.getByLabelText(/Email Subject/i);
    const contentInput = screen.getByLabelText(/Email Content/i);

    // MUI Textfield: valid strings
    fireEvent.change(subjectInput, { target: { value: "Valid Subject" } });
    fireEvent.change(contentInput, {
      target: { value: "<h1>Some valid HTML content</h1>" },
    });

    // Submit
    const submitBtn = screen.getByRole("button", { name: /Create Campaign/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(campaignApi.createCampaign).toHaveBeenCalledWith({
        subject: "Valid Subject",
        content: "<h1>Some valid HTML content</h1>",
      });
      expect(onCreatedMock).toHaveBeenCalled();
    });
  });
});
