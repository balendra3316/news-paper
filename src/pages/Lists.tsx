// import { useEffect, useState } from "react";
// import {
//     getLists,
//     createList,
//     updateList,
//     importListCSV,
// } from "../api/list.api";
// import AddCustomField from "../components/AddCustomField";
// import { useAuth } from "../context/AuthContext";

// type List = {
//     id: string;
//     name: string;
//     customFields?: Record<string, string>;
//     createdAt: string;
// };

// export default function Lists() {
//     const [lists, setLists] = useState<List[]>([]);
//     const [expanded, setExpanded] = useState<string | null>(null);
//     const [editing, setEditing] = useState<string | null>(null);
//     const [draft, setDraft] = useState<{
//         name?: string;
//         customFields: Record<string, string>;
//     }>({ customFields: {} });

//     const [newListName, setNewListName] = useState("");
//     const [showCreate, setShowCreate] = useState(false);
//     const [uploading, setUploading] = useState(false);
//     const { user } = useAuth();
//     const load = async () => {
//         const res = await getLists();
//         setLists(res.data);
//     };

//     useEffect(() => {
//         load();
//     }, []);

//     const startEdit = (l: List) => {
//         setEditing(l.id);
//         setDraft({
//             name: l.name,
//             customFields: l.customFields
//                 ? { ...l.customFields }
//                 : {},
//         });
//     };

//     const saveEdit = async (id: string) => {
//         console.log(draft.customFields);
//         await updateList(id, {
//             name: draft.name,
//             customFields: draft.customFields,
//         });
//         setEditing(null);
//         setDraft({ customFields: {} });
//         load();
//     };

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex justify-between items-center">
//                 <h1 className="text-xl font-semibold">Lists (Segments)</h1>
//                 <button
//                     onClick={() => setShowCreate(!showCreate)}
//                     className="bg-black text-white px-4 py-2"
//                 >
//                     {showCreate ? "Close" : "+ Create Segment"}
//                 </button>
//             </div>

//             {/* Create Segment */}
//             {showCreate && (
//                 <div className="border p-4 rounded bg-gray-50 space-y-3">
//                     <input
//                         className="border p-2 w-full"
//                         placeholder="Segment name"
//                         value={newListName}
//                         onChange={(e) => setNewListName(e.target.value)}
//                     />

//                     <button
//                         className="bg-black text-white px-4 py-2"
//                         onClick={async () => {
//                             if (!newListName.trim()) return;
//                             await createList({ name: newListName, organizationId: user?.organizationID });
//                             setNewListName("");
//                             setShowCreate(false);
//                             load();
//                         }}
//                     >
//                         Create Segment
//                     </button>
//                 </div>
//             )}

//             {/* Segment Cards */}
//             <div className="space-y-4">
//                 {lists.map((l) => {
//                     const isExpanded = expanded === l.id;
//                     const isEditing = editing === l.id;

//                     return (
//                         <div key={l.id} className="border rounded bg-white">
//                             {/* Header */}
//                             <div
//                                 className="p-4 cursor-pointer"
//                                 onClick={() =>
//                                     setExpanded(isExpanded ? null : l.id)
//                                 }
//                             >
//                                 <div className="font-semibold">{l.name}</div>
//                                 <div className="text-sm text-gray-500">
//                                     {Object.keys(l.customFields || {}).length} rules ·{" "}
//                                     {new Date(l.createdAt).toLocaleString()}
//                                 </div>
//                             </div>

//                             {/* Body */}
//                             {isExpanded && (
//                                 <div className="border-t p-4 space-y-4">
//                                     {/* Name */}
//                                     <div>
//                                         <label className="text-sm text-gray-500">
//                                             Segment Name
//                                         </label>
//                                         <input
//                                             className="border p-2 w-full"
//                                             disabled={!isEditing}
//                                             value={
//                                                 isEditing
//                                                     ? draft.name || ""
//                                                     : l.name
//                                             }
//                                             onChange={(e) =>
//                                                 setDraft({
//                                                     ...draft,
//                                                     name: e.target.value,
//                                                 })
//                                             }
//                                         />
//                                     </div>

//                                     {/* Rules Header + Import */}
//                                     <div className="flex justify-between items-center">
//                                         <label className="text-sm text-gray-500">
//                                             Segment Rules (AND logic)
//                                         </label>

//                                         {isEditing && (
//                                             <label className="text-sm text-blue-600 cursor-pointer">
//                                                 {uploading ? "Uploading..." : "Import CSV"}
//                                                 <input
//                                                     type="file"
//                                                     accept=".csv"
//                                                     className="hidden"
//                                                     onChange={async (e) => {
//                                                         const file = e.target.files?.[0];
//                                                         if (!file) return;

//                                                         setUploading(true);
//                                                         await importListCSV(l.id, file);
//                                                         setUploading(false);
//                                                         load();
//                                                     }}
//                                                 />
//                                             </label>
//                                         )}
//                                     </div>

//                                     {/* Rules */}
//                                     <div className="space-y-2">
//                                         {Object.entries(
//                                             isEditing
//                                                 ? draft.customFields
//                                                 : l.customFields || {}
//                                         ).map(([key, value]) => (
//                                             <div key={key} className="flex gap-2">
//                                                 <input
//                                                     className="border p-2 w-1/3 bg-gray-50"
//                                                     disabled
//                                                     value={key}
//                                                 />
//                                                 <input
//                                                     className="border p-2 flex-1"
//                                                     disabled={!isEditing}
//                                                     value={value}
//                                                     onChange={(e) =>
//                                                         setDraft({
//                                                             ...draft,
//                                                             customFields: {
//                                                                 ...draft.customFields,
//                                                                 [key]: e.target.value,
//                                                             },
//                                                         })
//                                                     }
//                                                 />
//                                             </div>
//                                         ))}

//                                         {isEditing && (
//                                             <AddCustomField
//                                                 onAdd={(key, value) =>
//                                                     setDraft({
//                                                         ...draft,
//                                                         customFields: {
//                                                             ...draft.customFields,
//                                                             [key]: value,
//                                                         },
//                                                     })
//                                                 }
//                                             />
//                                         )}

//                                         {!isEditing &&
//                                             Object.keys(l.customFields || {}).length ===
//                                             0 && (
//                                                 <div className="text-sm text-gray-400">
//                                                     No rules defined (matches all subscribers)
//                                                 </div>
//                                             )}
//                                     </div>

//                                     {/* Actions */}
//                                     <div className="flex justify-end gap-3">
//                                         {!isEditing ? (
//                                             <button
//                                                 onClick={() => startEdit(l)}
//                                                 className="border px-4 py-1"
//                                             >
//                                                 Edit Rules
//                                             </button>
//                                         ) : (
//                                             <>
//                                                 <button
//                                                     onClick={() => saveEdit(l.id)}
//                                                     className="bg-black text-white px-4 py-1"
//                                                 >
//                                                     Save
//                                                 </button>
//                                                 <button
//                                                     onClick={() => setEditing(null)}
//                                                     className="border px-4 py-1"
//                                                 >
//                                                     Cancel
//                                                 </button>
//                                             </>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  ExpandMore,
  Add,
  Close,
  Edit,
  Save,
  CloudUpload,
  SettingsInputComponent,
} from "@mui/icons-material";

import {
  getLists,
  createList,
  updateList,
  importListCSV,
} from "../api/list.api";
import AddCustomField from "../components/AddCustomField";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";
import useApi from "../hooks/useApi";

export default function Lists() {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { data: lists, loading, refresh } = useApi(getLists);

  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<any>({ customFields: {} });

  const [newListName, setNewListName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleCreate = async () => {
    if (!newListName.trim()) return;
    try {
      await createList({
        name: newListName,
        organizationId: user?.organizationID,
      });
      setNewListName("");
      setShowCreate(false);
      showSnackbar("Segment created successfully", "success");
      refresh();
    } catch (e) {
      showSnackbar("Error creating segment", "error");
    }
  };

  const startEdit = (l: any) => {
    setEditing(l.id);
    setDraft({
      name: l.name,
      customFields: l.customFields ? { ...l.customFields } : {},
    });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateList(id, {
        name: draft.name,
        customFields: draft.customFields,
      });
      setEditing(null);
      showSnackbar("Segment updated", "success");
      refresh();
    } catch (e) {
      showSnackbar("Update failed", "error");
    }
  };

  const handleFileUpload = async (e: any, listId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await importListCSV(listId, file);
      showSnackbar("CSV Imported successfully", "success");
      refresh();
    } catch (e) {
      showSnackbar("CSV Import failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box className="max-w-5xl mx-auto space-y-6 p-4">
      {/* Header */}
      <Box className="flex justify-between items-center">
        <Box>
          <Typography variant="h4" className="font-black text-slate-900">
            Segments
          </Typography>
          <Typography variant="body2" className="text-slate-500">
            Define rules to filter your subscribers automatically.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={showCreate ? <Close /> : <Add />}
          onClick={() => setShowCreate(!showCreate)}
          className={showCreate ? "bg-slate-500" : "bg-black"}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          {showCreate ? "Close" : "Create Segment"}
        </Button>
      </Box>

      {/* Create Segment Form */}
      {showCreate && (
        <Paper className="p-6 border-2 border-dashed border-slate-200 shadow-none bg-slate-50 rounded-xl">
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. London Subscribers"
              label="New Segment Name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="bg-white"
            />
            <Button
              variant="contained"
              className="bg-black"
              onClick={handleCreate}
            >
              Create
            </Button>
          </Stack>
        </Paper>
      )}

      {/* List Section */}
      <Box className="space-y-3">
        {loading && !lists ? (
          <Box className="text-center py-10">
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          lists?.map((l: any) => {
            const isExpanded = expanded === l.id;
            const isEditing = editing === l.id;

            return (
              <Accordion
                key={l.id}
                expanded={isExpanded}
                onChange={() => setExpanded(isExpanded ? null : l.id)}
                className="border border-slate-100 shadow-sm rounded-lg before:hidden"
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box className="flex justify-between items-center w-full pr-4">
                    <Box className="flex items-center gap-3">
                      <SettingsInputComponent className="text-slate-400" />
                      <Typography className="font-bold text-slate-800">
                        {l.name}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={`${
                          Object.keys(l.customFields || {}).length
                        } Rules`}
                        size="small"
                        variant="outlined"
                      />
                      <Typography
                        variant="caption"
                        className="text-slate-400 self-center"
                      >
                        {new Date(l.createdAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  </Box>
                </AccordionSummary>
                <AccordionDetails className="bg-slate-50/50 border-t border-slate-100 p-6 space-y-6">
                  {/* Edit Name */}
                  <Box>
                    <Typography
                      variant="caption"
                      className="font-bold text-slate-500 uppercase tracking-widest"
                    >
                      General Info
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      disabled={!isEditing}
                      value={isEditing ? draft.name : l.name}
                      onChange={(e) =>
                        setDraft({ ...draft, name: e.target.value })
                      }
                      className="mt-1 bg-white"
                    />
                  </Box>

                  {/* Rules Section */}
                  <Box className="space-y-3">
                    <Box className="flex justify-between items-center">
                      <Typography
                        variant="caption"
                        className="font-bold text-slate-500 uppercase tracking-widest"
                      >
                        Segmentation Rules (AND)
                      </Typography>
                      {isEditing && (
                        <Button
                          component="label"
                          size="small"
                          startIcon={
                            uploading ? (
                              <CircularProgress size={16} />
                            ) : (
                              <CloudUpload />
                            )
                          }
                          sx={{ textTransform: "none" }}
                        >
                          {uploading ? "Importing..." : "Import CSV"}
                          <input
                            type="file"
                            hidden
                            accept=".csv"
                            onChange={(e) => handleFileUpload(e, l.id)}
                          />
                        </Button>
                      )}
                    </Box>

                    <Stack spacing={1}>
                      {Object.entries(
                        isEditing ? draft.customFields : l.customFields || {}
                      ).map(([key, value]: any) => (
                        <Box
                          key={key}
                          className="flex gap-2 bg-white p-2 rounded border border-slate-200"
                        >
                          <Typography className="w-1/3 text-sm font-bold border-r border-slate-100">
                            {key}
                          </Typography>
                          {isEditing ? (
                            <input
                              className="flex-1 text-sm outline-none"
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
                          ) : (
                            <Typography className="flex-1 text-sm text-slate-600">
                              {value}
                            </Typography>
                          )}
                        </Box>
                      ))}
                      {isEditing && (
                        <AddCustomField
                          onAdd={(k, v) =>
                            setDraft({
                              ...draft,
                              customFields: { ...draft.customFields, [k]: v },
                            })
                          }
                        />
                      )}
                      {!isEditing &&
                        Object.keys(l.customFields || {}).length === 0 && (
                          <Typography
                            variant="body2"
                            className="text-slate-400 italic"
                          >
                            No rules defined. This segment will target everyone.
                          </Typography>
                        )}
                    </Stack>
                  </Box>

                  <Divider />

                  {/* Actions */}
                  <Box className="flex justify-end gap-2">
                    {!isEditing ? (
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => startEdit(l)}
                      >
                        Edit Segment
                      </Button>
                    ) : (
                      <>
                        <Button onClick={() => setEditing(null)}>Cancel</Button>
                        <Button
                          variant="contained"
                          className="bg-black"
                          startIcon={<Save />}
                          onClick={() => handleSaveEdit(l.id)}
                        >
                          Save Changes
                        </Button>
                      </>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })
        )}
      </Box>
    </Box>
  );
}
