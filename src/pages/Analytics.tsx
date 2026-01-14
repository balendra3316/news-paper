import { useEffect, useState } from "react";

import { getCampaigns } from "../api/campaign.api";

import CampaignSummary from "../components/analytics/CampaignSummary";
import GeoChart from "../components/analytics/GeoChart";
import DeviceChart from "../components/analytics/DeviceChart";
import TimelineChart from "../components/analytics/TimelineChart";
import LinksTable from "../components/analytics/LinksTable";

type Campaign = {
    id: string;
    subject: string;
};

export default function Analytics() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
        null
    );
    const [loading, setLoading] = useState(true);

    // Load campaigns
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const res = await getCampaigns();
            setCampaigns(res.data);

            // Auto-select first campaign
            if (res.data.length > 0) {
                setSelectedCampaignId(res.data[0].id);
            }

            setLoading(false);
        };

        load();
    }, []);

    if (loading) {
        return <div className="text-gray-500">Loading analytics…</div>;
    }

    if (!selectedCampaignId) {
        return (
            <div className="text-gray-500">
                No campaigns available
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header + Campaign Selector */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Campaign Analytics</h1>

                <select
                    className="border p-2"
                    value={selectedCampaignId}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                >
                    {campaigns.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.subject}
                        </option>
                    ))}
                </select>
            </div>

            {/* KPI Summary */}
            <CampaignSummary campaignId={selectedCampaignId} />

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
                <GeoChart campaignId={selectedCampaignId} />
                <DeviceChart campaignId={selectedCampaignId} />
            </div>

            {/* Timeline */}
            <TimelineChart campaignId={selectedCampaignId} />

            {/* Links Table */}
            <LinksTable campaignId={selectedCampaignId} />
        </div>
    );
}
