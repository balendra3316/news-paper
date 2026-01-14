import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

type CampaignFormData = {
    subject: string;
    content: string;
    organizationId: string;
};

export default function CampaignForm({
    onSubmit,
}: {
    onSubmit: (d: CampaignFormData) => void;
}) {
    const { user } = useAuth();
    console.log(user);
    const { register, handleSubmit } = useForm<CampaignFormData>({
        defaultValues: {
            organizationId: user?.organizationID,
        },
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 border p-4 rounded"
        >
            <input
                {...register("subject", { required: true })}
                placeholder="Campaign subject"
                className="border p-2 w-full"
            />

            <textarea
                {...register("content", { required: true })}
                placeholder="HTML content"
                className="border p-2 w-full h-40"
            />

            {/* Hidden orgId */}
            <input type="hidden" {...register("organizationId")} />

            <button className="bg-black text-white px-4 py-2 rounded">
                Save
            </button>
        </form>
    );
}
