// import { useEffect, useState } from "react";
// import { getCampaigns } from "../api/campaign.api";
// import { getLists } from "../api/list.api";
// import { getSubscribers } from "../api/subscriber.api";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//     const { user } = useAuth();
//     const navigate = useNavigate();

//     const [campaignsCount, setCampaignsCount] = useState(0);
//     const [listsCount, setListsCount] = useState(0);
//     const [subscribersCount, setSubscribersCount] = useState(0);
//     const [sentCampaigns, setSentCampaigns] = useState(0);

//     useEffect(() => {
//         const load = async () => {
//             const [campaignRes, listRes, subRes] = await Promise.all([
//                 getCampaigns(),
//                 getLists(),
//                 getSubscribers(),
//             ]);

//             setCampaignsCount(campaignRes.data.length);
//             setListsCount(listRes.data.length);
//             setSubscribersCount(subRes.data.length);

//             setSentCampaigns(
//                 campaignRes.data.filter((c: any) => c.opened > 0).length
//             );
//         };

//         load();
//     }, []);

//     return (
//         <div className="space-y-8">
//             {/* HEADER */}
//             <div>
//                 <h1 className="text-2xl font-semibold">
//                     Welcome{user?.email ? `, ${user.email}` : ""}
//                 </h1>
//                 <p className="text-gray-500 text-sm">
//                     Organization dashboard overview
//                 </p>
//             </div>

//             {/* KPI CARDS */}
//             <div className="grid md:grid-cols-4 gap-4">
//                 <DashboardCard
//                     title="Campaigns"
//                     value={campaignsCount}
//                     onClick={() => navigate("/campaigns")}
//                 />

//                 <DashboardCard
//                     title="Sent Campaigns"
//                     value={sentCampaigns}
//                     onClick={() => navigate("/campaigns")}
//                 />

//                 <DashboardCard
//                     title="Lists"
//                     value={listsCount}
//                     onClick={() => navigate("/lists")}
//                 />

//                 <DashboardCard
//                     title="Subscribers"
//                     value={subscribersCount}
//                     onClick={() => navigate("/subscribers")}
//                 />
//             </div>

//             {/* QUICK ACTIONS */}
//             <div className="grid md:grid-cols-3 gap-4">
//                 <QuickAction
//                     title="Create Campaign"
//                     description="Design and send a new email campaign"
//                     onClick={() => navigate("/campaigns")}
//                 />

//                 <QuickAction
//                     title="Manage Lists"
//                     description="Create lists and assign subscribers"
//                     onClick={() => navigate("/lists")}
//                 />

//                 <QuickAction
//                     title="View Analytics"
//                     description="Track opens, clicks and engagement"
//                     onClick={() => navigate("/analytics")}
//                 />
//             </div>
//         </div>
//     );
// }

// /* ---------------- COMPONENTS ---------------- */

// function DashboardCard({
//     title,
//     value,
//     onClick,
// }: {
//     title: string;
//     value: number;
//     onClick: () => void;
// }) {
//     return (
//         <div
//             onClick={onClick}
//             className="border bg-white p-4 rounded cursor-pointer hover:shadow transition"
//         >
//             <div className="text-sm text-gray-500">{title}</div>
//             <div className="text-2xl font-semibold">{value}</div>
//         </div>
//     );
// }

// function QuickAction({
//     title,
//     description,
//     onClick,
// }: {
//     title: string;
//     description: string;
//     onClick: () => void;
// }) {
//     return (
//         <div
//             onClick={onClick}
//             className="border bg-white p-5 rounded cursor-pointer hover:shadow transition"
//         >
//             <div className="font-semibold">{title}</div>
//             <div className="text-sm text-gray-500 mt-1">
//                 {description}
//             </div>
//         </div>
//     );
// }

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Box } from "@mui/material";
import { ListAlt, Assessment, AddCircle } from "@mui/icons-material";
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
              icon={<AddCircle fontSize="large" />}
              onClick={() => navigate("/campaigns")}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ActionCard
              title="Manage Lists"
              description="Import CSVs and segment your subscriber base."
              icon={<ListAlt fontSize="large" />}
              onClick={() => navigate("/lists")}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ActionCard
              title="Detailed Analytics"
              description="Check open rates, link clicks, and geo-locations."
              icon={<Assessment fontSize="large" />}
              onClick={() => navigate("/analytics")}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
