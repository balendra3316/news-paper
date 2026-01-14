import { useState, useEffect } from "react";
import { updateCampaign, deleteCampaign } from "../api/campaign.api";
import TemplateEditor from "./TemplateEditor";

export default function CampaignCard({
    campaign,
    lists,
    onUpdated,
    onSend,
    isEditingExternal,
    onEditStart,
    onEditEnd,
}: {
    campaign: any;
    lists: any[];
    onUpdated: () => void;
    onSend: () => void;
    isEditingExternal: boolean;
    onEditStart: () => void;
    onEditEnd: () => void;
}) {
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setIsEditing(isEditingExternal);
    }, [isEditingExternal]);

    const [form, setForm] = useState({
        subject: campaign.subject,
        content: campaign.content,
        listId: campaign.list?.id || "",
    });

    const isSent = campaign.opened > 0;

    return (
        <div className="border rounded bg-white p-6 space-y-4 w-full">
            {/* SUBJECT */}
            {isEditing ? (
                <input
                    className="border p-2 w-full text-lg font-medium"
                    value={form.subject}
                    onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                    }
                />
            ) : (
                <h3 className="font-semibold text-lg">
                    {campaign.subject}
                </h3>
            )}

            {/* CONTENT */}
            {isEditing ? (
                <TemplateEditor
                    value={form.content}
                    onChange={(html) =>
                        setForm({ ...form, content: html })
                    }
                />
            ) : (
                <div className="border rounded max-h-64 overflow-y-auto p-3">
                    <div
                        className="text-sm text-gray-600 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: campaign.content }}
                    />
                </div>
            )}

            {/* LIST */}
            {isEditing && !isSent ? (
                <select
                    className="border p-2 w-full"
                    value={form.listId}
                    onChange={(e) =>
                        setForm({ ...form, listId: e.target.value })
                    }
                >
                    <option value="">Select List</option>
                    {lists.map((l) => (
                        <option key={l.id} value={l.id}>
                            {l.name}
                        </option>
                    ))}
                </select>
            ) : (
                <div className="text-sm">
                    List:{" "}
                    <span className="font-medium">
                        {campaign.list?.name || "—"}
                    </span>
                </div>
            )}

            {/* STATUS */}
            <div className="text-sm">
                Status:{" "}
                {isSent ? (
                    <span className="text-green-600">SENT</span>
                ) : (
                    <span className="text-gray-500">DRAFT</span>
                )}
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between items-center pt-2">
                <div className="space-x-3">
                    {!isSent && (
                        <>
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={async () => {
                                            await updateCampaign(campaign.id, {
                                                subject: form.subject,
                                                content: form.content,
                                                listId: form.listId || undefined,
                                            });
                                            setIsEditing(false);
                                            onEditEnd();
                                            onUpdated();
                                        }}
                                        className="text-green-600"
                                    >
                                        Save
                                    </button>

                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            onEditEnd();
                                        }}
                                        className="text-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        onEditStart();
                                    }}
                                    className="text-blue-600"
                                >
                                    Edit
                                </button>
                            )}
                        </>
                    )}

                    <button
                        onClick={async () => {
                            await deleteCampaign(campaign.id);
                            onUpdated();
                        }}
                        className="text-red-600"
                    >
                        Delete
                    </button>
                </div>

                {!isSent && campaign.list && !isEditing && (
                    <button
                        onClick={onSend}
                        className="bg-black text-white px-4 py-1 rounded"
                    >
                        Send
                    </button>
                )}
            </div>
        </div>
    );
}
