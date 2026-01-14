import api from "../lib/axios";

export const getCampaignSummary = (campaignId: string) =>
    api.get(`/tracker/analytics/${campaignId}/summary`);

export const getGeoAnalytics = (campaignId: string) =>
    api.get(`/tracker/analytics/${campaignId}/geo`);

export const getDeviceAnalytics = (campaignId: string) =>
    api.get(`/tracker/analytics/${campaignId}/devices`);

export const getTimelineAnalytics = (
    campaignId: string,
    type: "OPEN" | "CLICK"
) =>
    api.get(`/tracker/analytics/${campaignId}/timeline`, {
        params: { type },
    });

export const getCampaignLinks = (campaignId: string) =>
    api.get(`/tracker/campaigns/${campaignId}/links`);

export const getLinkStats = (linkId: string) =>
    api.get(`/tracker/links/${linkId}/stats`);
