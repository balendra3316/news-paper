// src/components/subscribers/SubscriberCard.tsx
import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { ExpandMore, Edit, Save, Email } from "@mui/icons-material";
import { updateSubscriber } from "../../api/subscriber.api";
import { useSnackbar } from "../../context/SnackbarContext";

export default function SubscriberCard({
  subscriber,
  isExpanded,
  onToggle,
  onUpdated,
}: any) {
  const { showSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(subscriber.email);
  const [fields, setFields] = useState(subscriber.customFields || {});

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent accordion from toggling
    try {
      await updateSubscriber(subscriber.id, { email, customFields: fields });
      showSnackbar("Subscriber updated", "success");
      setIsEditing(false);
      onUpdated();
    } catch (err) {
      showSnackbar("Update failed", "error");
    }
  };

  return (
    <Accordion
      expanded={isExpanded}
      onChange={onToggle}
      className="shadow-sm border border-slate-100 rounded-lg overflow-hidden before:hidden"
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box className="flex items-center gap-3">
          <Email className="text-slate-400" />
          <Box>
            <Typography className="font-bold text-slate-800">
              {subscriber.email}
            </Typography>
            <Typography variant="caption" className="text-slate-500">
              Added: {new Date(subscriber.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails className="bg-slate-50/50 p-6 space-y-4">
        <Stack spacing={3}>
          <TextField
            label="Email Address"
            fullWidth
            size="small"
            disabled={!isEditing}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Typography
            variant="subtitle2"
            className="text-slate-600 font-bold uppercase text-[10px] tracking-widest"
          >
            Custom Metadata
          </Typography>

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(fields).map(([key, value]: any) => (
              <TextField
                key={key}
                label={key}
                fullWidth
                size="small"
                disabled={!isEditing}
                value={value}
                onChange={(e) =>
                  setFields({ ...fields, [key]: e.target.value })
                }
              />
            ))}
          </Box>

          <Box className="flex justify-end gap-2 pt-4">
            {!isEditing ? (
              <Button startIcon={<Edit />} onClick={() => setIsEditing(true)}>
                Edit Details
              </Button>
            ) : (
              <>
                <Button color="inherit" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  className="bg-black"
                  onClick={handleSave}
                  startIcon={<Save />}
                >
                  Save Changes
                </Button>
              </>
            )}
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
