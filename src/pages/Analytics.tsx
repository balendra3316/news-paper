// import { useEffect, useState } from "react";

// import { getCampaigns } from "../api/campaign.api";

// import CampaignSummary from "../components/analytics/CampaignSummary";
// import GeoChart from "../components/analytics/GeoChart";
// import DeviceChart from "../components/analytics/DeviceChart";
// import TimelineChart from "../components/analytics/TimelineChart";
// import LinksTable from "../components/analytics/LinksTable";

// type Campaign = {
//     id: string;
//     subject: string;
// };

// export default function Analytics() {
//     const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//     const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
//         null
//     );
//     const [loading, setLoading] = useState(true);

//     // Load campaigns
//     useEffect(() => {
//         const load = async () => {
//             setLoading(true);
//             const res = await getCampaigns();
//             setCampaigns(res.data);

//             // Auto-select first campaign
//             if (res.data.length > 0) {
//                 setSelectedCampaignId(res.data[0].id);
//             }

//             setLoading(false);
//         };

//         load();
//     }, []);

//     if (loading) {
//         return <div className="text-gray-500">Loading analytics…</div>;
//     }

//     if (!selectedCampaignId) {
//         return (
//             <div className="text-gray-500">
//                 No campaigns available
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-8">
//             {/* Header + Campaign Selector */}
//             <div className="flex justify-between items-center">
//                 <h1 className="text-xl font-semibold">Campaign Analytics</h1>

//                 <select
//                     className="border p-2"
//                     value={selectedCampaignId}
//                     onChange={(e) => setSelectedCampaignId(e.target.value)}
//                 >
//                     {campaigns.map((c) => (
//                         <option key={c.id} value={c.id}>
//                             {c.subject}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             {/* KPI Summary */}
//             <CampaignSummary campaignId={selectedCampaignId} />

//             {/* Charts */}
//             <div className="grid md:grid-cols-2 gap-6">
//                 <GeoChart campaignId={selectedCampaignId} />
//                 <DeviceChart campaignId={selectedCampaignId} />
//             </div>

//             {/* Timeline */}
//             <TimelineChart campaignId={selectedCampaignId} />

//             {/* Links Table */}
//             <LinksTable campaignId={selectedCampaignId} />
//         </div>
//     );
// }

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
import { AnalyticsOutlined, CampaignOutlined } from "@mui/icons-material";

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
        <CampaignOutlined className="text-slate-300 text-6xl mb-2" />
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
            <AnalyticsOutlined fontSize="large" className="text-blue-600" />
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
