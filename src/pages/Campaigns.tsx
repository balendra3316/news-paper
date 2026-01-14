import { useEffect, useState } from "react";
import CreateCampaignForm from "../components/CreateCampaignForm";
import CampaignCard from "../components/CampaignCard";
import SendCampaignPopup from "../components/SendCampaignPopup";
import { getCampaigns } from "../api/campaign.api";
import { getLists } from "../api/list.api";

type Campaign = {
    id: string;
    subject: string;
    content: string;
    opened: number;
    list: {
        id: string;
        name: string;
        customFields: Record<string, string>;
    } | null;
};

type List = {
    id: string;
    name: string;
};

export default function Campaigns() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [lists, setLists] = useState<List[]>([]);
    const [sendCampaign, setSendCampaign] = useState<Campaign | null>(null);

    const [showCreate, setShowCreate] = useState(false);
    const [editingCampaignId, setEditingCampaignId] = useState<string | null>(
        null
    );

    const load = async () => {
        const [cRes, lRes] = await Promise.all([
            getCampaigns(),
            getLists(),
        ]);
        setCampaigns(cRes.data);
        setLists(lRes.data);
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Campaigns</h1>

                <button
                    onClick={() => setShowCreate((v) => !v)}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    {showCreate ? "Close" : "New Campaign"}
                </button>
            </div>

            {/* CREATE CAMPAIGN */}
            {showCreate && (
                <CreateCampaignForm
                    onCreated={() => {
                        setShowCreate(false);
                        load();
                    }}
                />
            )}

            {/* CAMPAIGN CARDS */}
            <div
                className={
                    editingCampaignId
                        ? "space-y-4"
                        : "grid md:grid-cols-2 gap-4"
                }
            >
                {campaigns.map((c) => {
                    // Hide other cards while editing
                    if (editingCampaignId && editingCampaignId !== c.id)
                        return null;

                    return (
                        <CampaignCard
                            key={c.id}
                            campaign={c}
                            lists={lists}
                            isEditingExternal={editingCampaignId === c.id}
                            onEditStart={() => setEditingCampaignId(c.id)}
                            onEditEnd={() => setEditingCampaignId(null)}
                            onUpdated={load}
                            onSend={() => setSendCampaign(c)}
                        />
                    );
                })}
            </div>

            {/* SEND POPUP */}
            {sendCampaign && sendCampaign.list && (
                <SendCampaignPopup
                    campaignId={sendCampaign.id}
                    list={sendCampaign.list}
                    onClose={() => {
                        setSendCampaign(null);
                        load();
                    }}
                />
            )}
        </div>
    );
}
