import api from "../lib/axios";

export const getSubscribers = (page = 1, limit = 10) =>
    api.get("/subscribers", {
        params: { page, limit },
    });

export const createSubscriber = (data: {
    email: string;
    customFields?: Record<string, any>;
}) => api.post("/subscribers", data);

export const updateSubscriber = (
    id: string,
    data: {
        email?: string;
        customFields?: Record<string, any>;
    }
) => api.put(`/subscribers/${id}`, data);
