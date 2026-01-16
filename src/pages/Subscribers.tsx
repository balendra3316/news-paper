// import { useEffect, useState } from "react";
// import {
//     getSubscribers,
//     createSubscriber,
//     updateSubscriber,
// } from "../api/subscriber.api";
// import {
//     getLists,
//     segmentSubscribers,
// } from "../api/list.api";
// import CreateSubscriberForm from "../components/CreateSubscriberForm";
// import AddCustomField from "../components/AddCustomField";

// type Subscriber = {
//     id: string;
//     email: string;
//     customFields?: Record<string, string>;
//     createdAt: string;
//     organization?: {
//         id: string;
//         name: string;
//     };
// };

// type List = {
//     id: string;
//     name: string;
//     customFields?: Record<string, string>;
// };

// export default function Subscribers() {
//     const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
//     const [lists, setLists] = useState<List[]>([]);
//     const [selectedList, setSelectedList] = useState<List | null>(null);

//     const [expanded, setExpanded] = useState<string | null>(null);
//     const [editing, setEditing] = useState<string | null>(null);
//     const [draft, setDraft] = useState<Partial<Subscriber>>({});
//     const [showCreate, setShowCreate] = useState(false);

//     /* ---------------- LOADERS ---------------- */

//     const loadLists = async () => {
//         const res = await getLists();
//         setLists(res.data);
//     };

//     const loadAllSubscribers = async () => {
//         const res = await getSubscribers();
//         setSubscribers(res.data);
//     };

//     const loadSubscribersByList = async (list: List) => {
//         const filters = list.customFields || {};
//         const res = await segmentSubscribers(list.id, filters);
//         setSubscribers(res.data.data);
//     };

//     useEffect(() => {
//         loadLists();
//         loadAllSubscribers();
//     }, []);

//     /* ---------------- FILTER HANDLERS ---------------- */

//     const onSelectList = async (listId: string) => {
//         const list = lists.find((l) => l.id === listId) || null;
//         setSelectedList(list);

//         if (list) {
//             await loadSubscribersByList(list);
//         } else {
//             await loadAllSubscribers();
//         }
//     };

//     const clearFilter = async () => {
//         setSelectedList(null);
//         await loadAllSubscribers();
//     };

//     /* ---------------- EDIT HANDLERS ---------------- */

//     const startEdit = (s: Subscriber) => {
//         setEditing(s.id);
//         setDraft({
//             email: s.email,
//             customFields: { ...(s.customFields || {}) },
//         });
//     };

//     const saveEdit = async (id: string) => {
//         await updateSubscriber(id, {
//             email: draft.email,
//             customFields: draft.customFields,
//         });

//         setEditing(null);
//         setDraft({});

//         selectedList
//             ? loadSubscribersByList(selectedList)
//             : loadAllSubscribers();
//     };

//     /* ---------------- UI ---------------- */

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex justify-between items-center">
//                 <h1 className="text-xl font-semibold">Subscribers</h1>
//                 <button
//                     onClick={() => setShowCreate(!showCreate)}
//                     className="bg-black text-white px-4 py-2"
//                 >
//                     {showCreate ? "Close" : "+ Add Subscriber"}
//                 </button>
//             </div>

//             {/* List Filter */}
//             <div className="flex items-center gap-3">
//                 <select
//                     className="border p-2"
//                     value={selectedList?.id || ""}
//                     onChange={(e) => onSelectList(e.target.value)}
//                 >
//                     <option value="">All Subscribers</option>
//                     {lists.map((l) => (
//                         <option key={l.id} value={l.id}>
//                             {l.name}
//                         </option>
//                     ))}
//                 </select>

//                 {selectedList && (
//                     <button
//                         onClick={clearFilter}
//                         className="text-sm text-red-600"
//                     >
//                         ✕ Clear
//                     </button>
//                 )}
//             </div>

//             {/* Create Subscriber */}
//             {showCreate && (
//                 <CreateSubscriberForm
//                     onSubmit={async (data) => {
//                         await createSubscriber(data);
//                         setShowCreate(false);

//                         selectedList
//                             ? loadSubscribersByList(selectedList)
//                             : loadAllSubscribers();
//                     }}
//                     onCancel={() => setShowCreate(false)}
//                 />
//             )}

//             {/* Subscriber Cards */}
//             <div className="space-y-4">
//                 {subscribers.map((s) => {
//                     const isExpanded = expanded === s.id;
//                     const isEditing = editing === s.id;

//                     return (
//                         <div key={s.id} className="border rounded bg-white">
//                             {/* Card Header */}
//                             <div
//                                 className="p-4 cursor-pointer"
//                                 onClick={() =>
//                                     setExpanded(isExpanded ? null : s.id)
//                                 }
//                             >
//                                 <div className="font-semibold">{s.email}</div>
//                                 <div className="text-sm text-gray-500">
//                                     {s.organization?.name} ·{" "}
//                                     {new Date(s.createdAt).toLocaleString()}
//                                 </div>
//                             </div>

//                             {/* Accordion Body */}
//                             {isExpanded && (
//                                 <div className="border-t p-4 space-y-4">
//                                     {/* Email */}
//                                     <div>
//                                         <label className="text-sm text-gray-500">
//                                             Email
//                                         </label>
//                                         <input
//                                             className="border p-2 w-full"
//                                             disabled={!isEditing}
//                                             value={
//                                                 isEditing
//                                                     ? draft.email || ""
//                                                     : s.email
//                                             }
//                                             onChange={(e) =>
//                                                 setDraft({
//                                                     ...draft,
//                                                     email: e.target.value,
//                                                 })
//                                             }
//                                         />
//                                     </div>

//                                     {/* Custom Fields */}
//                                     <div>
//                                         <label className="text-sm text-gray-500">
//                                             Custom Fields
//                                         </label>

//                                         <div className="space-y-2">
//                                             {Object.entries(
//                                                 (isEditing
//                                                     ? draft.customFields
//                                                     : s.customFields) || {},
//                                             ).map(([key, value]) => (
//                                                 <div key={key} className="flex gap-2">
//                                                     <input
//                                                         className="border p-2 w-1/3 bg-gray-50"
//                                                         disabled
//                                                         value={key}
//                                                     />
//                                                     <input
//                                                         className="border p-2 flex-1"
//                                                         disabled={!isEditing}
//                                                         value={value}
//                                                         onChange={(e) =>
//                                                             setDraft({
//                                                                 ...draft,
//                                                                 customFields: {
//                                                                     ...(draft.customFields || {}),
//                                                                     [key]: e.target.value,
//                                                                 },
//                                                             })
//                                                         }
//                                                     />
//                                                 </div>
//                                             ))}

//                                             {isEditing && (
//                                                 <AddCustomField
//                                                     onAdd={(key, value) =>
//                                                         setDraft({
//                                                             ...draft,
//                                                             customFields: {
//                                                                 ...(draft.customFields || {}),
//                                                                 [key]: value,
//                                                             },
//                                                         })
//                                                     }
//                                                 />
//                                             )}
//                                         </div>
//                                     </div>

//                                     {/* Actions */}
//                                     <div className="flex justify-end gap-3">
//                                         {!isEditing ? (
//                                             <button
//                                                 onClick={() => startEdit(s)}
//                                                 className="border px-4 py-1"
//                                             >
//                                                 Edit
//                                             </button>
//                                         ) : (
//                                             <>
//                                                 <button
//                                                     onClick={() => saveEdit(s.id)}
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

import { useState, lazy, Suspense } from "react";
import {
  Box,
  Typography,
  Button,
  MenuItem,
  TextField,
  CircularProgress,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import { Add, FilterList, Clear, PersonOutline } from "@mui/icons-material";

import useApi from "../hooks/useApi";
import { getSubscribers } from "../api/subscriber.api";
import { getLists, segmentSubscribers } from "../api/list.api";
import { useSnackbar } from "../context/SnackbarContext";
import SubscriberCard from "../components/subscribers/SubscriberCard";

// Optimization: Lazy load the creation form
const CreateSubscriberForm = lazy(
  () => import("../components/CreateSubscriberForm")
);

// Define an Interface for List to fix the 'any' type errors
interface SubscriberList {
  id: string;
  name: string;
  customFields?: Record<string, string>;
}

export default function Subscribers() {
  const { showSnackbar } = useSnackbar();
  const [selectedListId, setSelectedListId] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // API Hooks - Typed correctly
  const listsApi = useApi<SubscriberList[]>(getLists);
  const subsApi = useApi<any[]>(getSubscribers);

  const lists = listsApi.data || [];

  // Fixed: Properly typed 'l' as SubscriberList
  // const currentSelectedList = useMemo(() =>
  //     lists.find((l: SubscriberList) => l.id === selectedListId),
  // [lists, selectedListId]);

  // Handler for Filtering - Fixes the "Expected 0 arguments, but got 1" errors
  const handleListChange = async (listId: string) => {
    setSelectedListId(listId);
    if (listId) {
      const list = lists.find((l: SubscriberList) => l.id === listId);
      // We pass a function that calls the segment API
      subsApi.refresh(() =>
        segmentSubscribers(listId, list?.customFields || {})
      );
    } else {
      // We pass the function reference back to load all
      subsApi.refresh(getSubscribers);
    }
  };

  const handleCreated = () => {
    setShowCreate(false);
    showSnackbar("Subscriber added successfully!", "success");
    subsApi.refresh(getSubscribers);
  };

  return (
    <Box className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Box>
          <Typography variant="h4" className="font-black text-slate-900">
            Subscribers
          </Typography>
          <Typography variant="body2" className="text-slate-500">
            View and segment your audience.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={showCreate ? <Clear /> : <Add />}
          onClick={() => setShowCreate(!showCreate)}
          className={showCreate ? "bg-slate-500" : "bg-black"}
          sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
        >
          {showCreate ? "Cancel" : "Add Subscriber"}
        </Button>
      </Box>

      {/* Filter Bar */}
      <Paper className="p-4 flex flex-wrap items-center gap-4 shadow-sm border border-slate-100 rounded-xl">
        <Box className="flex items-center gap-2 grow">
          {" "}
          {/* Changed flex-grow to grow */}
          <FilterList className="text-slate-400" />
          <TextField
            select
            size="small"
            label="Filter by List"
            value={selectedListId}
            onChange={(e) => handleListChange(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Subscribers</MenuItem>
            {lists.map(
              (
                l: SubscriberList // Fixed: Typed 'l'
              ) => (
                <MenuItem key={l.id} value={l.id}>
                  {l.name}
                </MenuItem>
              )
            )}
          </TextField>
          {selectedListId && (
            <IconButton size="small" onClick={() => handleListChange("")}>
              <Clear fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Chip
          icon={<PersonOutline />}
          label={`Count: ${subsApi.data?.length || 0}`}
          variant="outlined"
          className="font-bold"
        />
      </Paper>

      {/* Form Section - Fixes the 'onCreated' property error */}
      {showCreate && (
        <Suspense fallback={<CircularProgress />}>
          <CreateSubscriberForm
            onSubmit={handleCreated} // Changed from onCreated to onSubmit to match your component prop type
            onCancel={() => setShowCreate(false)}
          />
        </Suspense>
      )}

      {/* List Section */}
      <Box className="space-y-3">
        {subsApi.loading ? (
          <Box className="flex justify-center py-10">
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          subsApi.data?.map((s: any) => (
            <SubscriberCard
              key={s.id}
              subscriber={s}
              isExpanded={expandedId === s.id}
              onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
              onUpdated={() => subsApi.refresh(getSubscribers)}
            />
          ))
        )}
        {!subsApi.loading && subsApi.data?.length === 0 && (
          <Typography className="text-center py-20 text-slate-400 italic">
            No subscribers found.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
