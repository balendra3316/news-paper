// import { useState, useEffect } from "react";
// import { updateCampaign, deleteCampaign } from "../api/campaign.api";
// import TemplateEditor from "./TemplateEditor";

// export default function CampaignCard({
//     campaign,
//     lists,
//     onUpdated,
//     onSend,
//     isEditingExternal,
//     onEditStart,
//     onEditEnd,
// }: {
//     campaign: any;
//     lists: any[];
//     onUpdated: () => void;
//     onSend: () => void;
//     isEditingExternal: boolean;
//     onEditStart: () => void;
//     onEditEnd: () => void;
// }) {
//     const [isEditing, setIsEditing] = useState(false);

//     useEffect(() => {
//         setIsEditing(isEditingExternal);
//     }, [isEditingExternal]);

//     const [form, setForm] = useState({
//         subject: campaign.subject,
//         content: campaign.content,
//         listId: campaign.list?.id || "",
//     });

//     const isSent = campaign.opened > 0;

//     return (
//         <div className="border rounded bg-white p-6 space-y-4 w-full">
//             {/* SUBJECT */}
//             {isEditing ? (
//                 <input
//                     className="border p-2 w-full text-lg font-medium"
//                     value={form.subject}
//                     onChange={(e) =>
//                         setForm({ ...form, subject: e.target.value })
//                     }
//                 />
//             ) : (
//                 <h3 className="font-semibold text-lg">
//                     {campaign.subject}
//                 </h3>
//             )}

//             {/* CONTENT */}
//             {isEditing ? (
//                 <TemplateEditor
//                     value={form.content}
//                     onChange={(html) =>
//                         setForm({ ...form, content: html })
//                     }
//                 />
//             ) : (
//                 <div className="border rounded max-h-64 overflow-y-auto p-3">
//                     <div
//                         className="text-sm text-gray-600 prose max-w-none"
//                         dangerouslySetInnerHTML={{ __html: campaign.content }}
//                     />
//                 </div>
//             )}

//             {/* LIST */}
//             {isEditing && !isSent ? (
//                 <select
//                     className="border p-2 w-full"
//                     value={form.listId}
//                     onChange={(e) =>
//                         setForm({ ...form, listId: e.target.value })
//                     }
//                 >
//                     <option value="">Select List</option>
//                     {lists.map((l) => (
//                         <option key={l.id} value={l.id}>
//                             {l.name}
//                         </option>
//                     ))}
//                 </select>
//             ) : (
//                 <div className="text-sm">
//                     List:{" "}
//                     <span className="font-medium">
//                         {campaign.list?.name || "—"}
//                     </span>
//                 </div>
//             )}

//             {/* STATUS */}
//             <div className="text-sm">
//                 Status:{" "}
//                 {isSent ? (
//                     <span className="text-green-600">SENT</span>
//                 ) : (
//                     <span className="text-gray-500">DRAFT</span>
//                 )}
//             </div>

//             {/* ACTIONS */}
//             <div className="flex justify-between items-center pt-2">
//                 <div className="space-x-3">
//                     {!isSent && (
//                         <>
//                             {isEditing ? (
//                                 <>
//                                     <button
//                                         onClick={async () => {
//                                             await updateCampaign(campaign.id, {
//                                                 subject: form.subject,
//                                                 content: form.content,
//                                                 listId: form.listId || undefined,
//                                             });
//                                             setIsEditing(false);
//                                             onEditEnd();
//                                             onUpdated();
//                                         }}
//                                         className="text-green-600"
//                                     >
//                                         Save
//                                     </button>

//                                     <button
//                                         onClick={() => {
//                                             setIsEditing(false);
//                                             onEditEnd();
//                                         }}
//                                         className="text-gray-500"
//                                     >
//                                         Cancel
//                                     </button>
//                                 </>
//                             ) : (
//                                 <button
//                                     onClick={() => {
//                                         setIsEditing(true);
//                                         onEditStart();
//                                     }}
//                                     className="text-blue-600"
//                                 >
//                                     Edit
//                                 </button>
//                             )}
//                         </>
//                     )}

//                     <button
//                         onClick={async () => {
//                             await deleteCampaign(campaign.id);
//                             onUpdated();
//                         }}
//                         className="text-red-600"
//                     >
//                         Delete
//                     </button>
//                 </div>

//                 {!isSent && campaign.list && !isEditing && (
//                     <button
//                         onClick={onSend}
//                         className="bg-black text-white px-4 py-1 rounded"
//                     >
//                         Send
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// }
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Edit,
  Delete,
  Send,
  Save,
  Close,
  EmailOutlined,
  ListAltOutlined,
} from "@mui/icons-material";
import { updateCampaign, deleteCampaign } from "../api/campaign.api";
import TemplateEditor from "./TemplateEditor";
import { useSnackbar } from "../context/SnackbarContext";

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
  const { showSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    subject: campaign.subject,
    content: campaign.content,
    listId: campaign.list?.id || "",
  });

  useEffect(() => {
    setIsEditing(isEditingExternal);
  }, [isEditingExternal]);

  const isSent = campaign.opened > 0;

  const handleSave = async () => {
    try {
      await updateCampaign(campaign.id, {
        subject: form.subject,
        content: form.content,
        listId: form.listId || undefined,
      });
      showSnackbar("Campaign updated successfully", "success");
      setIsEditing(false);
      onEditEnd();
      onUpdated();
    } catch (error) {
      showSnackbar("Failed to update campaign", "error");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await deleteCampaign(campaign.id);
        showSnackbar("Campaign deleted", "info");
        onUpdated();
      } catch (error) {
        showSnackbar("Error deleting campaign", "error");
      }
    }
  };

  return (
    <Card
      className={`transition-all duration-300 border ${
        isEditing
          ? "ring-2 ring-black shadow-2xl"
          : "hover:shadow-lg shadow-sm border-slate-100"
      }`}
    >
      <CardContent className="p-0">
        {/* CARD HEADER */}
        <Box className="p-5 flex justify-between items-start bg-slate-50/50">
          <Box className="flex-1 mr-4">
            {isEditing ? (
              <TextField
                fullWidth
                label="Campaign Subject"
                variant="standard"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                InputProps={{ style: { fontSize: "1.25rem", fontWeight: 600 } }}
              />
            ) : (
              <Typography
                variant="h6"
                className="font-bold text-slate-800 line-clamp-1"
              >
                {campaign.subject}
              </Typography>
            )}
          </Box>
          <Chip
            label={isSent ? "SENT" : "DRAFT"}
            color={isSent ? "success" : "default"}
            size="small"
            className="font-bold px-2"
            variant={isSent ? "filled" : "outlined"}
          />
        </Box>

        <Divider />

        {/* CARD CONTENT / EDITOR */}
        <Box className="p-5">
          {isEditing ? (
            <Box className="space-y-4">
              <Typography
                variant="caption"
                className="text-slate-500 uppercase font-bold tracking-wider"
              >
                Content Editor
              </Typography>
              <TemplateEditor
                value={form.content}
                onChange={(html) => setForm({ ...form, content: html })}
              />

              {!isSent && (
                <TextField
                  select
                  fullWidth
                  label="Target Subscriber List"
                  value={form.listId}
                  onChange={(e) => setForm({ ...form, listId: e.target.value })}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {lists.map((l) => (
                    <MenuItem key={l.id} value={l.id}>
                      {l.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Box>
          ) : (
            <Box className="space-y-4">
              <Box className="border rounded-lg bg-slate-50 overflow-hidden max-h-48 overflow-y-auto">
                <div
                  className="p-4 text-sm text-slate-600 prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: campaign.content }}
                />
              </Box>

              <Box className="flex gap-4 items-center">
                <Box className="flex items-center text-slate-500 gap-1">
                  <ListAltOutlined fontSize="small" />
                  <Typography variant="body2">
                    List: <b>{campaign.list?.name || "Unassigned"}</b>
                  </Typography>
                </Box>
                <Box className="flex items-center text-slate-500 gap-1">
                  <EmailOutlined fontSize="small" />
                  <Typography variant="body2">
                    Clicks: <b>{campaign.opened}</b>
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        <Divider />

        {/* CARD ACTIONS */}
        <Box className="p-3 bg-white flex justify-between items-center">
          <Box>
            <Tooltip title="Delete Campaign">
              <IconButton
                onClick={handleDelete}
                color="error"
                size="small"
                className="hover:bg-red-50"
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>

          <Box className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    onEditEnd();
                  }}
                  variant="text"
                  className="text-slate-500"
                  startIcon={<Close />}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  variant="contained"
                  className="bg-black text-white hover:bg-slate-800"
                  startIcon={<Save />}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                {!isSent && (
                  <Button
                    onClick={() => {
                      setIsEditing(true);
                      onEditStart();
                    }}
                    variant="outlined"
                    className="border-slate-300 text-slate-700"
                    startIcon={<Edit />}
                  >
                    Edit
                  </Button>
                )}
                {!isSent && campaign.list && (
                  <Button
                    onClick={onSend}
                    variant="contained"
                    className="bg-black text-white hover:bg-slate-800"
                    startIcon={<Send />}
                  >
                    Send
                  </Button>
                )}
              </>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
