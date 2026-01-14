import api from "../lib/axios";

export const getCampaigns = () => api.get("/campaigns");
export const createCampaign = (data: any) => api.post("/campaigns", data);
export const updateCampaign = (id: string, data: any) =>
    api.put(`/campaigns/${id}`, data);

export const deleteCampaign = (id: string) =>
    api.delete(`/campaigns/${id}`);

export const sendCampaignToList = (
    campaignId: string,
    filters: Record<string, string>
) => api.post(`/campaigns/${campaignId}/send`, filters);

