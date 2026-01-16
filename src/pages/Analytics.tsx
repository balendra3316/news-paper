import { useState, useEffect, lazy, Suspense } from "react";
import {
  Box,
  Typography,
  MenuItem,
  TextField,
  Skeleton,
  Stack,
} from "@mui/material";
import { Grid } from "@mui/material"; // Use the new Grid2 API
import { BarChart, Megaphone } from "lucide-react";

import { getCampaigns } from "../api/campaign.api";
import { useSnackbar } from "../context/SnackbarContext";
import useApi from "../hooks/useApi";

// Lazy load child components
const CampaignSummary = lazy(
  () => import("../components/analytics/CampaignSummary")
);
const GeoChart = lazy(() => import("../components/analytics/GeoChart"));
const DeviceChart = lazy(() => import("../components/analytics/DeviceChart"));
const TimelineChart = lazy(
  () => import("../components/analytics/TimelineChart")
);
const LinksTable = lazy(() => import("../components/analytics/LinksTable"));

export default function Analytics() {
  const { showSnackbar } = useSnackbar();
  const { data: campaigns, loading: campaignsLoading } = useApi(getCampaigns);
  const [selectedId, setSelectedId] = useState<string>("");

  // Auto-select first campaign once data is loaded
  useEffect(() => {
    if (campaigns && campaigns.length > 0 && !selectedId) {
      setSelectedId(campaigns[0].id);
    }
  }, [campaigns, selectedId]);

  const handleCampaignChange = (id: string) => {
    setSelectedId(id);
    showSnackbar("Analytics updated", "info");
  };

  if (campaignsLoading && !campaigns) {
    return <AnalyticsSkeleton />;
  }

  if (!campaignsLoading && (!campaigns || campaigns.length === 0)) {
    return (
      <Box className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-2xl">
        <Megaphone className="text-slate-300 mb-2" size={60} />
        <Typography className="text-slate-500">
          No campaigns found for analysis.
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="space-y-8 max-w-7xl mx-auto p-2">
      {/* Header + Selector */}
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Box>
          <Typography
            variant="h4"
            className="font-black text-slate-900 flex items-center gap-2"
          >
            <BarChart size={35} className="text-blue-600" />
            Campaign Analytics
          </Typography>
          <Typography variant="body2" className="text-slate-500">
            Deep dive into open rates, link clicks, and audience behavior.
          </Typography>
        </Box>

        <TextField
          select
          label="Select Campaign"
          value={selectedId}
          onChange={(e) => handleCampaignChange(e.target.value)}
          sx={{ minWidth: 280 }}
          className="bg-white"
        >
          {campaigns?.map((c: any) => (
            <MenuItem key={c.id} value={c.id}>
              {c.subject}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Content with Lazy Loading and Suspense Skeletons */}
      <Suspense fallback={<AnalyticsSkeleton />}>
        {selectedId && (
          <Stack spacing={4}>
            {/* KPI Summary */}
            <CampaignSummary campaignId={selectedId} />

            {/* Charts Grid - Using new Grid API */}
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <GeoChart campaignId={selectedId} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <DeviceChart campaignId={selectedId} />
              </Grid>
            </Grid>

            {/* Timeline */}
            <TimelineChart campaignId={selectedId} />

            {/* Links Table */}
            <LinksTable campaignId={selectedId} />
          </Stack>
        )}
      </Suspense>
    </Box>
  );
}

/** * Modular Skeleton UI for the "Super Polished" look
 */
function AnalyticsSkeleton() {
  return (
    <Box className="space-y-6">
      <Skeleton variant="text" width="40%" height={60} />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Skeleton variant="rectangular" height={120} className="rounded-xl" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Skeleton variant="rectangular" height={120} className="rounded-xl" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Skeleton variant="rectangular" height={120} className="rounded-xl" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Skeleton variant="rectangular" height={120} className="rounded-xl" />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton variant="rectangular" height={300} className="rounded-xl" />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton variant="rectangular" height={300} className="rounded-xl" />
        </Grid>
      </Grid>
    </Box>
  );
}
