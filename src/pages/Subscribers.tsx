import { useEffect, useState } from "react";
import {
    getSubscribers,
    createSubscriber,
    updateSubscriber,
} from "../api/subscriber.api";
import {
    getLists,
    segmentSubscribers,
} from "../api/list.api";
import CreateSubscriberForm from "../components/CreateSubscriberForm";
import AddCustomField from "../components/AddCustomField";

type Subscriber = {
    id: string;
    email: string;
    customFields?: Record<string, string>;
    createdAt: string;
    organization?: {
        id: string;
        name: string;
    };
};

type List = {
    id: string;
    name: string;
    customFields?: Record<string, string>;
};

export default function Subscribers() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [lists, setLists] = useState<List[]>([]);
    const [selectedList, setSelectedList] = useState<List | null>(null);

    const [expanded, setExpanded] = useState<string | null>(null);
    const [editing, setEditing] = useState<string | null>(null);
    const [draft, setDraft] = useState<Partial<Subscriber>>({});
    const [showCreate, setShowCreate] = useState(false);

    /* ---------------- LOADERS ---------------- */

    const loadLists = async () => {
        const res = await getLists();
        setLists(res.data);
    };

    const loadAllSubscribers = async () => {
        const res = await getSubscribers();
        setSubscribers(res.data);
    };

    const loadSubscribersByList = async (list: List) => {
        const filters = list.customFields || {};
        const res = await segmentSubscribers(list.id, filters);
        setSubscribers(res.data.data);
    };

    useEffect(() => {
        loadLists();
        loadAllSubscribers();
    }, []);

    /* ---------------- FILTER HANDLERS ---------------- */

    const onSelectList = async (listId: string) => {
        const list = lists.find((l) => l.id === listId) || null;
        setSelectedList(list);

        if (list) {
            await loadSubscribersByList(list);
        } else {
            await loadAllSubscribers();
        }
    };

    const clearFilter = async () => {
        setSelectedList(null);
        await loadAllSubscribers();
    };

    /* ---------------- EDIT HANDLERS ---------------- */

    const startEdit = (s: Subscriber) => {
        setEditing(s.id);
        setDraft({
            email: s.email,
            customFields: { ...(s.customFields || {}) },
        });
    };

    const saveEdit = async (id: string) => {
        await updateSubscriber(id, {
            email: draft.email,
            customFields: draft.customFields,
        });

        setEditing(null);
        setDraft({});

        selectedList
            ? loadSubscribersByList(selectedList)
            : loadAllSubscribers();
    };

    /* ---------------- UI ---------------- */

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Subscribers</h1>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="bg-black text-white px-4 py-2"
                >
                    {showCreate ? "Close" : "+ Add Subscriber"}
                </button>
            </div>

            {/* List Filter */}
            <div className="flex items-center gap-3">
                <select
                    className="border p-2"
                    value={selectedList?.id || ""}
                    onChange={(e) => onSelectList(e.target.value)}
                >
                    <option value="">All Subscribers</option>
                    {lists.map((l) => (
                        <option key={l.id} value={l.id}>
                            {l.name}
                        </option>
                    ))}
                </select>

                {selectedList && (
                    <button
                        onClick={clearFilter}
                        className="text-sm text-red-600"
                    >
                        ✕ Clear
                    </button>
                )}
            </div>

            {/* Create Subscriber */}
            {showCreate && (
                <CreateSubscriberForm
                    onSubmit={async (data) => {
                        await createSubscriber(data);
                        setShowCreate(false);

                        selectedList
                            ? loadSubscribersByList(selectedList)
                            : loadAllSubscribers();
                    }}
                    onCancel={() => setShowCreate(false)}
                />
            )}

            {/* Subscriber Cards */}
            <div className="space-y-4">
                {subscribers.map((s) => {
                    const isExpanded = expanded === s.id;
                    const isEditing = editing === s.id;

                    return (
                        <div key={s.id} className="border rounded bg-white">
                            {/* Card Header */}
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() =>
                                    setExpanded(isExpanded ? null : s.id)
                                }
                            >
                                <div className="font-semibold">{s.email}</div>
                                <div className="text-sm text-gray-500">
                                    {s.organization?.name} ·{" "}
                                    {new Date(s.createdAt).toLocaleString()}
                                </div>
                            </div>

                            {/* Accordion Body */}
                            {isExpanded && (
                                <div className="border-t p-4 space-y-4">
                                    {/* Email */}
                                    <div>
                                        <label className="text-sm text-gray-500">
                                            Email
                                        </label>
                                        <input
                                            className="border p-2 w-full"
                                            disabled={!isEditing}
                                            value={
                                                isEditing
                                                    ? draft.email || ""
                                                    : s.email
                                            }
                                            onChange={(e) =>
                                                setDraft({
                                                    ...draft,
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    {/* Custom Fields */}
                                    <div>
                                        <label className="text-sm text-gray-500">
                                            Custom Fields
                                        </label>

                                        <div className="space-y-2">
                                            {Object.entries(
                                                (isEditing
                                                    ? draft.customFields
                                                    : s.customFields) || {},
                                            ).map(([key, value]) => (
                                                <div key={key} className="flex gap-2">
                                                    <input
                                                        className="border p-2 w-1/3 bg-gray-50"
                                                        disabled
                                                        value={key}
                                                    />
                                                    <input
                                                        className="border p-2 flex-1"
                                                        disabled={!isEditing}
                                                        value={value}
                                                        onChange={(e) =>
                                                            setDraft({
                                                                ...draft,
                                                                customFields: {
                                                                    ...(draft.customFields || {}),
                                                                    [key]: e.target.value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </div>
                                            ))}

                                            {isEditing && (
                                                <AddCustomField
                                                    onAdd={(key, value) =>
                                                        setDraft({
                                                            ...draft,
                                                            customFields: {
                                                                ...(draft.customFields || {}),
                                                                [key]: value,
                                                            },
                                                        })
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end gap-3">
                                        {!isEditing ? (
                                            <button
                                                onClick={() => startEdit(s)}
                                                className="border px-4 py-1"
                                            >
                                                Edit
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => saveEdit(s.id)}
                                                    className="bg-black text-white px-4 py-1"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditing(null)}
                                                    className="border px-4 py-1"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
