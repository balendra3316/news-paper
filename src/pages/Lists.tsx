import { useEffect, useState } from "react";
import {
    getLists,
    createList,
    updateList,
    importListCSV,
} from "../api/list.api";
import AddCustomField from "../components/AddCustomField";
import { useAuth } from "../context/AuthContext";

type List = {
    id: string;
    name: string;
    customFields?: Record<string, string>;
    createdAt: string;
};

export default function Lists() {
    const [lists, setLists] = useState<List[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [editing, setEditing] = useState<string | null>(null);
    const [draft, setDraft] = useState<{
        name?: string;
        customFields: Record<string, string>;
    }>({ customFields: {} });

    const [newListName, setNewListName] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { user } = useAuth();
    const load = async () => {
        const res = await getLists();
        setLists(res.data);
    };

    useEffect(() => {
        load();
    }, []);

    const startEdit = (l: List) => {
        setEditing(l.id);
        setDraft({
            name: l.name,
            customFields: l.customFields
                ? { ...l.customFields }
                : {},
        });
    };

    const saveEdit = async (id: string) => {
        console.log(draft.customFields);
        await updateList(id, {
            name: draft.name,
            customFields: draft.customFields,
        });
        setEditing(null);
        setDraft({ customFields: {} });
        load();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Lists (Segments)</h1>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="bg-black text-white px-4 py-2"
                >
                    {showCreate ? "Close" : "+ Create Segment"}
                </button>
            </div>

            {/* Create Segment */}
            {showCreate && (
                <div className="border p-4 rounded bg-gray-50 space-y-3">
                    <input
                        className="border p-2 w-full"
                        placeholder="Segment name"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                    />

                    <button
                        className="bg-black text-white px-4 py-2"
                        onClick={async () => {
                            if (!newListName.trim()) return;
                            await createList({ name: newListName, organizationId: user?.organizationID });
                            setNewListName("");
                            setShowCreate(false);
                            load();
                        }}
                    >
                        Create Segment
                    </button>
                </div>
            )}

            {/* Segment Cards */}
            <div className="space-y-4">
                {lists.map((l) => {
                    const isExpanded = expanded === l.id;
                    const isEditing = editing === l.id;

                    return (
                        <div key={l.id} className="border rounded bg-white">
                            {/* Header */}
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() =>
                                    setExpanded(isExpanded ? null : l.id)
                                }
                            >
                                <div className="font-semibold">{l.name}</div>
                                <div className="text-sm text-gray-500">
                                    {Object.keys(l.customFields || {}).length} rules ·{" "}
                                    {new Date(l.createdAt).toLocaleString()}
                                </div>
                            </div>

                            {/* Body */}
                            {isExpanded && (
                                <div className="border-t p-4 space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="text-sm text-gray-500">
                                            Segment Name
                                        </label>
                                        <input
                                            className="border p-2 w-full"
                                            disabled={!isEditing}
                                            value={
                                                isEditing
                                                    ? draft.name || ""
                                                    : l.name
                                            }
                                            onChange={(e) =>
                                                setDraft({
                                                    ...draft,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    {/* Rules Header + Import */}
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm text-gray-500">
                                            Segment Rules (AND logic)
                                        </label>

                                        {isEditing && (
                                            <label className="text-sm text-blue-600 cursor-pointer">
                                                {uploading ? "Uploading..." : "Import CSV"}
                                                <input
                                                    type="file"
                                                    accept=".csv"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        setUploading(true);
                                                        await importListCSV(l.id, file);
                                                        setUploading(false);
                                                        load();
                                                    }}
                                                />
                                            </label>
                                        )}
                                    </div>

                                    {/* Rules */}
                                    <div className="space-y-2">
                                        {Object.entries(
                                            isEditing
                                                ? draft.customFields
                                                : l.customFields || {}
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
                                                                ...draft.customFields,
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
                                                            ...draft.customFields,
                                                            [key]: value,
                                                        },
                                                    })
                                                }
                                            />
                                        )}

                                        {!isEditing &&
                                            Object.keys(l.customFields || {}).length ===
                                            0 && (
                                                <div className="text-sm text-gray-400">
                                                    No rules defined (matches all subscribers)
                                                </div>
                                            )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end gap-3">
                                        {!isEditing ? (
                                            <button
                                                onClick={() => startEdit(l)}
                                                className="border px-4 py-1"
                                            >
                                                Edit Rules
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => saveEdit(l.id)}
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
