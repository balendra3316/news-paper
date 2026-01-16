import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "../layout/Sidebar";
import { BrowserRouter } from "react-router-dom";

// Mock React Router parts if needed, but using BrowserRouter wrapper is usually enough.
// To test 'active' state, we might need to mock NavLink or use a memory router with entries.

describe("Sidebar Layout", () => {
  it("renders the sidebar title", () => {
    render(
      <BrowserRouter>
        <Sidebar mobileOpen={false} handleDrawerToggle={vi.fn()} />
      </BrowserRouter>
    );
    expect(screen.getAllByText("NEWSLETTER")[0]).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(
      <BrowserRouter>
        <Sidebar mobileOpen={false} handleDrawerToggle={vi.fn()} />
      </BrowserRouter>
    );

    expect(screen.getAllByText("Dashboard")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Campaigns")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Subscribers")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Lists")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Analytics")[0]).toBeInTheDocument();
  });

  it("calls handleDrawerToggle when a link is clicked in mobile view", () => {
    const handleToggle = vi.fn();
    render(
      <BrowserRouter>
        <Sidebar mobileOpen={true} handleDrawerToggle={handleToggle} />
      </BrowserRouter>
    );

    // Click on a link (Dashboard)
    // Sidebar renders content twice (mobile drawer + desktop drawer), causing multiple matches.
    // We select the first one found.
    fireEvent.click(screen.getAllByText("Dashboard")[0]);

    expect(handleToggle).toHaveBeenCalled();
  });

  it("does not call handleDrawerToggle when mobileOpen is false", () => {
    const handleToggle = vi.fn();
    render(
      <BrowserRouter>
        <Sidebar mobileOpen={false} handleDrawerToggle={handleToggle} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getAllByText("Dashboard")[0]);
    expect(handleToggle).not.toHaveBeenCalled();
  });
});
