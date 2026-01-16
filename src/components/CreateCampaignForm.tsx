// import { useState } from "react";
// import { createCampaign } from "../api/campaign.api";
// import TemplateEditor from "./TemplateEditor";

// export default function CreateCampaignForm({
//     onCreated,
// }: {
//     onCreated: () => void;
// }) {
//     const [subject, setSubject] = useState("");
//     const [content, setContent] = useState("");

//     return (
//         <div className="border p-4 rounded bg-white space-y-3">
//             <h2 className="font-semibold text-lg">Create Campaign</h2>

//             <input
//                 className="border p-2 w-full"
//                 placeholder="Subject"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//             />

//             <TemplateEditor value={content} onChange={setContent} />

//             <button
//                 onClick={async () => {
//                     await createCampaign({ subject, content });
//                     setSubject("");
//                     setContent("");
//                     onCreated();
//                 }}
//                 className="bg-black text-white px-4 py-2"
//             >
//                 Create Campaign
//             </button>
//         </div>
//     );
// }

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { createCampaign } from "../api/campaign.api";

const schema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  content: z.string().min(10, "Content is too short"),
});

type FormData = z.infer<typeof schema>;

export default function CreateCampaignForm({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createCampaign(data);
      onCreated();
    } catch (error) {
      console.error("Failed to create campaign", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <Typography variant="h6" className="font-bold mb-2">
        New Campaign Details
      </Typography>

      <TextField
        fullWidth
        label="Email Subject"
        {...register("subject")}
        error={!!errors.subject}
        helperText={errors.subject?.message}
        placeholder="e.g. Monthly Newsletter Jan 2026"
      />

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Email Content (HTML supported)"
        {...register("content")}
        error={!!errors.content}
        helperText={errors.content?.message}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        className="bg-black hover:bg-slate-800 py-2 px-8"
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Create Campaign"
        )}
      </Button>
    </Box>
  );
}
