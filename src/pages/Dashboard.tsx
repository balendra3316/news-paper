import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Box } from "@mui/material";
import { List, BarChart, PlusCircle } from "lucide-react";
import useApi from "../hooks/useApi";
import { getCampaigns } from "../api/campaign.api";
import { getLists } from "../api/list.api";
import { getSubscribers } from "../api/subscriber.api";
import StatCard from "../components/dashboard/StatCard";
import ActionCard from "../components/dashboard/ActionCard";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Using our custom hook for clean data fetching
  const campaigns = useApi(getCampaigns);
  const lists = useApi(getLists);
  const subscribers = useApi(getSubscribers);

  const loading = campaigns.loading || lists.loading || subscribers.loading;

  const sentCount =
    campaigns.data?.filter((c: any) => c.opened > 0).length || 0;

  return (
    <Box className="max-w-7xl mx-auto space-y-10 p-2">
      {/* HEADER SECTION */}
      <Box>
        <Typography variant="h4" className="font-black text-slate-900">
          Welcome back,{" "}
          <span className="text-blue-600">{user?.email?.split("@")[0]}</span> 👋
        </Typography>
        <Typography variant="body1" className="text-slate-500 mt-1">
          Here is what's happening with your newsletters today.
        </Typography>
      </Box>

      {/* KPI GRID */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Total Campaigns"
            value={campaigns.data?.length || 0}
            loading={loading}
            onClick={() => navigate("/campaigns")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Sent Successfully"
            value={sentCount}
            loading={loading}
            onClick={() => navigate("/campaigns")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Active Lists"
            value={lists.data?.length || 0}
            loading={loading}
            onClick={() => navigate("/lists")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Subscribers"
            value={subscribers.data?.length || 0}
            loading={loading}
            onClick={() => navigate("/subscribers")}
          />
        </Grid>
      </Grid>

      {/* QUICK ACTIONS SECTION */}
      <Box>
        <Typography variant="h6" className="font-bold mb-4 text-slate-800">
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <ActionCard
              title="Create Campaign"
              description="Design a new newsletter and reach your audience."
              icon={<PlusCircle size={35} />}
              onClick={() => navigate("/campaigns")}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ActionCard
              title="Manage Lists"
              description="Import CSVs and segment your subscriber base."
              icon={<List size={35} />}
              onClick={() => navigate("/lists")}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ActionCard
              title="Detailed Analytics"
              description="Check open rates, link clicks, and geo-locations."
              icon={<BarChart size={35} />}
              onClick={() => navigate("/analytics")}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
