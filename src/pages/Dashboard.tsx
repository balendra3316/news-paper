import { useEffect, useState } from "react";
import { getCampaigns } from "../api/campaign.api";
import { getLists } from "../api/list.api";
import { getSubscribers } from "../api/subscriber.api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [campaignsCount, setCampaignsCount] = useState(0);
    const [listsCount, setListsCount] = useState(0);
    const [subscribersCount, setSubscribersCount] = useState(0);
    const [sentCampaigns, setSentCampaigns] = useState(0);

    useEffect(() => {
        const load = async () => {
            const [campaignRes, listRes, subRes] = await Promise.all([
                getCampaigns(),
                getLists(),
                getSubscribers(),
            ]);

            setCampaignsCount(campaignRes.data.length);
            setListsCount(listRes.data.length);
            setSubscribersCount(subRes.data.length);

            setSentCampaigns(
                campaignRes.data.filter((c: any) => c.opened > 0).length
            );
        };

        load();
    }, []);

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-semibold">
                    Welcome{user?.email ? `, ${user.email}` : ""}
                </h1>
                <p className="text-gray-500 text-sm">
                    Organization dashboard overview
                </p>
            </div>

            {/* KPI CARDS */}
            <div className="grid md:grid-cols-4 gap-4">
                <DashboardCard
                    title="Campaigns"
                    value={campaignsCount}
                    onClick={() => navigate("/campaigns")}
                />

                <DashboardCard
                    title="Sent Campaigns"
                    value={sentCampaigns}
                    onClick={() => navigate("/campaigns")}
                />

                <DashboardCard
                    title="Lists"
                    value={listsCount}
                    onClick={() => navigate("/lists")}
                />

                <DashboardCard
                    title="Subscribers"
                    value={subscribersCount}
                    onClick={() => navigate("/subscribers")}
                />
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid md:grid-cols-3 gap-4">
                <QuickAction
                    title="Create Campaign"
                    description="Design and send a new email campaign"
                    onClick={() => navigate("/campaigns")}
                />

                <QuickAction
                    title="Manage Lists"
                    description="Create lists and assign subscribers"
                    onClick={() => navigate("/lists")}
                />

                <QuickAction
                    title="View Analytics"
                    description="Track opens, clicks and engagement"
                    onClick={() => navigate("/analytics")}
                />
            </div>
        </div>
    );
}

/* ---------------- COMPONENTS ---------------- */

function DashboardCard({
    title,
    value,
    onClick,
}: {
    title: string;
    value: number;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className="border bg-white p-4 rounded cursor-pointer hover:shadow transition"
        >
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-2xl font-semibold">{value}</div>
        </div>
    );
}

function QuickAction({
    title,
    description,
    onClick,
}: {
    title: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className="border bg-white p-5 rounded cursor-pointer hover:shadow transition"
        >
            <div className="font-semibold">{title}</div>
            <div className="text-sm text-gray-500 mt-1">
                {description}
            </div>
        </div>
    );
}
