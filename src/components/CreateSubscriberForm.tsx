import { useState } from "react";

export default function CreateSubscriberForm({
    onSubmit,
    onCancel,
}: {
    onSubmit: (data: {
        email: string;
        customFields: Record<string, string>;
    }) => void;
    onCancel?: () => void;
}) {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    return (
        <div className="border rounded p-4 space-y-3 bg-gray-50">
            <input
                className="border p-2 w-full"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="border p-2 w-full"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />

            <input
                className="border p-2 w-full"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />

            <div className="flex gap-2">
                <button
                    className="bg-black text-white px-4 py-2"
                    onClick={() =>
                        onSubmit({
                            email,
                            customFields: { firstName, lastName },
                        })
                    }
                >
                    Save
                </button>

                {onCancel && (
                    <button className="border px-4 py-2" onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}
