import { useState } from "react";

export default function AddSubscriberInline({
    onSubmit,
    onCancel,
}: {
    onSubmit: (s: {
        email: string;
        customFields: Record<string, string>;
    }) => void;
    onCancel: () => void;
}) {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    return (
        <div className="border rounded bg-gray-50 p-4 space-y-2">
            <input
                className="border p-2 w-full"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="border p-2 w-full"
                placeholder="First Name (optional)"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />

            <input
                className="border p-2 w-full"
                placeholder="Last Name (optional)"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />

            <div className="flex gap-2">
                <button
                    onClick={() =>
                        onSubmit({
                            email,
                            customFields: { firstName, lastName },
                        })
                    }
                    className="bg-black text-white px-4 py-2"
                >
                    Add Subscriber
                </button>

                <button onClick={onCancel} className="border px-4 py-2">
                    Cancel
                </button>
            </div>
        </div>
    );
}
