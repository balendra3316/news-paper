import { useState } from "react";
import { createCampaign } from "../api/campaign.api";
import TemplateEditor from "./TemplateEditor";

export default function CreateCampaignForm({
    onCreated,
}: {
    onCreated: () => void;
}) {
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");

    return (
        <div className="border p-4 rounded bg-white space-y-3">
            <h2 className="font-semibold text-lg">Create Campaign</h2>

            <input
                className="border p-2 w-full"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
            />

            <TemplateEditor value={content} onChange={setContent} />

            <button
                onClick={async () => {
                    await createCampaign({ subject, content });
                    setSubject("");
                    setContent("");
                    onCreated();
                }}
                className="bg-black text-white px-4 py-2"
            >
                Create Campaign
            </button>
        </div>
    );
}
