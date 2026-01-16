import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // Import the Menu Icon
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 260;

export default function DashboardLayout() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Function to toggle the sidebar
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9fafb" }}>
      {/* 1. TOPBAR (AppBar) */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
          bgcolor: "white",
          color: "#111827",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* THIS IS THE MENU BUTTON - Visible only on mobile/tablet */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { lg: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              sx={{ fontWeight: 700, display: { xs: "none", sm: "block" } }}
            >
              Admin Panel
            </Typography>
          </Box>

          {/* User Profile Section (Right Side) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                display: { xs: "none", sm: "block" },
              }}
            >
              {user?.email}
            </Typography>
            <Tooltip title="Account">
              <Avatar
                sx={{
                  bgcolor: "#3b82f6",
                  width: 35,
                  height: 35,
                  fontSize: "1rem",
                }}
              >
                {user?.email?.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 2. SIDEBAR (The responsive Drawer component we created) */}
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* 3. MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          // This margin ensures content doesn't hide behind the AppBar
          mt: { xs: "56px", sm: "64px" },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
