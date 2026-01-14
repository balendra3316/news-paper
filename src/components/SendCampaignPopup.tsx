import { useEffect, useState } from "react";
import { sendCampaignToList } from "../api/campaign.api";

type FilterRow = {
    key: string;
    value: string;
};

export default function SendCampaignPopup({
    campaignId,
    list,
    onClose,
}: {
    campaignId: string;
    list: {
        id: string;
        customFields: Record<string, string>;
    };
    onClose: () => void;
}) {
    const [filters, setFilters] = useState<FilterRow[]>([]);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        setFilters(
            Object.entries(list.customFields || {}).map(
                ([key, value]) => ({
                    key,
                    value: String(value),
                })
            )
        );
    }, [list]);

    const update = (
        index: number,
        field: "key" | "value",
        value: string
    ) => {
        const copy = [...filters];
        copy[index][field] = value;
        setFilters(copy);
    };

    const addRow = () =>
        setFilters([...filters, { key: "", value: "" }]);

    const removeRow = (i: number) =>
        setFilters(filters.filter((_, idx) => idx !== i));

    const send = async () => {
        const payload: Record<string, string> = {};
        filters.forEach((f) => {
            if (f.key && f.value) payload[f.key] = f.value;
        });

        setSending(true);
        await sendCampaignToList(campaignId,
            payload,
        );
        setSending(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[420px] rounded shadow">
                <div className="border-b p-4 font-semibold">
                    Send Campaign
                </div>

                <div className="p-4 space-y-3">
                    {filters.map((f, i) => (
                        <div key={i} className="flex gap-2">
                            <input
                                className="border p-2 w-1/3"
                                value={f.key}
                                onChange={(e) =>
                                    update(i, "key", e.target.value)
                                }
                            />
                            <input
                                className="border p-2 flex-1"
                                value={f.value}
                                onChange={(e) =>
                                    update(i, "value", e.target.value)
                                }
                            />
                            <button
                                onClick={() => removeRow(i)}
                                className="text-red-600"
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={addRow}
                        className="text-blue-600 text-sm"
                    >
                        + Add Filter
                    </button>
                </div>

                <div className="border-t p-4 flex justify-end gap-2">
                    <button onClick={onClose} className="border px-4 py-2">
                        Cancel
                    </button>
                    <button
                        disabled={sending}
                        onClick={send}
                        className="bg-black text-white px-4 py-2"
                    >
                        {sending ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
}
