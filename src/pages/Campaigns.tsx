import { useState } from "react";
import {
  Button,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Fade,
  Tooltip,
} from "@mui/material";
import { Plus, X, RefreshCcw } from "lucide-react";

import CreateCampaignForm from "../components/CreateCampaignForm";
import CampaignCard from "../components/CampaignCard";
import SendCampaignPopup from "../components/SendCampaignPopup";
import { getCampaigns } from "../api/campaign.api";
import { getLists } from "../api/list.api";
import useApi from "../hooks/useApi";
import { useSnackbar } from "../context/SnackbarContext";

export default function Campaigns() {
  const { showSnackbar } = useSnackbar();

  // Custom Hooks for data fetching
  const campaignsApi = useApi(getCampaigns);
  const listsApi = useApi(getLists);

  const [sendCampaign, setSendCampaign] = useState<any | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(
    null
  );

  // Manual Refresh Function
  const handleRefresh = async () => {
    await Promise.all([campaignsApi.refresh(), listsApi.refresh()]);
    showSnackbar("Data synced", "success");
  };

  const isLoading = campaignsApi.loading || listsApi.loading;

  return (
    <Box className="space-y-6 max-w-7xl mx-auto p-4">
      {/* HEADER AREA */}
      <Box className="flex justify-between items-center mb-8">
        <div>
          <Typography variant="h4" className="font-black text-slate-900">
            Campaigns
          </Typography>
          <Typography variant="body2" className="text-slate-500">
            Manage and track your email broadcasts
          </Typography>
        </div>

        <div className="flex gap-2">
          <Tooltip title="Refresh Data">
            <Button
              variant="outlined"
              onClick={handleRefresh}
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <RefreshCcw />
            </Button>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={showCreate ? <X /> : <Plus />}
            onClick={() => setShowCreate(!showCreate)}
            className={`${
              showCreate
                ? "bg-red-500 hover:bg-red-600"
                : "bg-black hover:bg-slate-800"
            } text-white px-6 py-2 rounded-lg transition-all shadow-lg`}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            {showCreate ? "Cancel" : "New Campaign"}
          </Button>
        </div>
      </Box>

      {/* CREATE CAMPAIGN FORM SECTION */}
      {showCreate && (
        <Fade in={showCreate}>
          <Box className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
            <CreateCampaignForm
              onCreated={() => {
                setShowCreate(false);
                campaignsApi.refresh();
                showSnackbar("Campaign created successfully!", "success");
              }}
            />
          </Box>
        </Fade>
      )}

      {/* LOADING STATE */}
      {isLoading && !campaignsApi.data ? (
        <Box className="flex flex-col items-center justify-center py-20">
          <CircularProgress color="inherit" />
          <Typography className="mt-4 text-slate-500">
            Loading campaigns...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {campaignsApi.data?.map((c: any) => {
            // Hide other cards while editing to focus the user
            if (editingCampaignId && editingCampaignId !== c.id) return null;

            return (
              <Grid
                size={{ xs: 12, md: editingCampaignId ? 12 : 6 }}
                key={c.id}
              >
                <CampaignCard
                  campaign={c}
                  lists={listsApi.data || []}
                  isEditingExternal={editingCampaignId === c.id}
                  onEditStart={() => setEditingCampaignId(c.id)}
                  onEditEnd={() => setEditingCampaignId(null)}
                  onUpdated={() => {
                    campaignsApi.refresh();
                    showSnackbar("Campaign updated", "success");
                  }}
                  onSend={() => setSendCampaign(c)}
                />
              </Grid>
            );
          })}

          {/* EMPTY STATE */}
          {!isLoading && campaignsApi.data?.length === 0 && (
            <Box className="w-full py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl">
              <Typography className="text-slate-400">
                No campaigns found. Start by creating one!
              </Typography>
            </Box>
          )}
        </Grid>
      )}

      {/* SEND CAMPAIGN DIALOG */}
      {sendCampaign && sendCampaign.list && (
        <SendCampaignPopup
          campaignId={sendCampaign.id}
          list={sendCampaign.list}
          onClose={() => {
            setSendCampaign(null);
            campaignsApi.refresh();
          }}
        />
      )}
    </Box>
  );
}
