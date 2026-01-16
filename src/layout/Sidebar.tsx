// import { NavLink } from "react-router-dom";

// const links = [
//     { to: "/", label: "Dashboard" },
//     { to: "/campaigns", label: "Campaigns" },
//     { to: "/subscribers", label: "Subscribers" },
//     { to: "/lists", label: "Lists" },
//     { to: "/analytics", label: "Analytics" },
// ];

// export default function Sidebar() {
//     return (
//         <aside className="w-64 bg-black text-white hidden md:block">
//             <div className="p-4 font-bold text-lg">Email Panel</div>
//             <nav className="space-y-1">
//                 {links.map((l) => (
//                     <NavLink
//                         key={l.to}
//                         to={l.to}
//                         className={({ isActive }) =>
//                             `block px-4 py-2 ${isActive ? "bg-gray-800" : "hover:bg-gray-900"
//                             }`
//                         }
//                     >
//                         {l.label}
//                     </NavLink>
//                 ))}
//             </nav>
//         </aside>
//     );
// }

import { NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Toolbar,
} from "@mui/material";
import {
  DashboardOutlined,
  SendOutlined,
  PeopleOutlined,
  ListAltOutlined,
  BarChartOutlined,
  EmailOutlined,
} from "@mui/icons-material";

const drawerWidth = 260;

const links = [
  { to: "/", label: "Dashboard", icon: <DashboardOutlined /> },
  { to: "/campaigns", label: "Campaigns", icon: <SendOutlined /> },
  { to: "/subscribers", label: "Subscribers", icon: <PeopleOutlined /> },
  { to: "/lists", label: "Lists", icon: <ListAltOutlined /> },
  { to: "/analytics", label: "Analytics", icon: <BarChartOutlined /> },
];

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export default function Sidebar({
  mobileOpen,
  handleDrawerToggle,
}: SidebarProps) {
  const drawerContent = (
    <Box sx={{ height: "100%", bgcolor: "#111827", color: "white" }}>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1 }}>
          <EmailOutlined sx={{ color: "#3b82f6", fontSize: 28 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, letterSpacing: -0.5 }}
          >
            NEWSLETTER
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
      <List sx={{ px: 2, py: 3 }}>
        {links.map((link) => (
          <ListItem key={link.to} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={NavLink}
              to={link.to}
              onClick={() => {
                if (mobileOpen) handleDrawerToggle(); // Close drawer on mobile click
              }}
              sx={{
                borderRadius: "12px",
                "&.active": {
                  bgcolor: "rgba(59, 130, 246, 0.15)",
                  color: "#3b82f6",
                  "& .MuiListItemIcon-root": { color: "#3b82f6" },
                },
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                },
              }}
            >
              <ListItemIcon
                sx={{ color: "rgba(255,255,255,0.6)", minWidth: 45 }}
              >
                {link.icon}
              </ListItemIcon>
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
    >
      {/* MOBILE DRAWER */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better performance on mobile.
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            border: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* DESKTOP DRAWER (Always Open) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            border: "none",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
