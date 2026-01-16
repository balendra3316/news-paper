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
import { Plus, Filter, X, User } from "lucide-react";

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
          startIcon={showCreate ? <X /> : <Plus />}
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
          <Filter className="text-slate-400" />
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
              <X size={20} />
            </IconButton>
          )}
        </Box>
        <Chip
          icon={<User />}
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
