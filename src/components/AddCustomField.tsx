import { useState } from "react";

export default function AddCustomField({
    onAdd,
}: {
    onAdd: (key: string, value: string) => void;
}) {
    const [keyName, setKeyName] = useState("");
    const [value, setValue] = useState("");

    return (
        <div className="flex gap-2">
            <input
                className="border p-2 w-1/3"
                placeholder="Field name"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
            />
            <input
                className="border p-2 flex-1"
                placeholder="Value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button
                className="border px-3"
                onClick={() => {
                    if (!keyName.trim()) return;
                    onAdd(keyName.trim(), value);
                    setKeyName("");
                    setValue("");
                }}
            >
                Add
            </button>
        </div>
    );
}
