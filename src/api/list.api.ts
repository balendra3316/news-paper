import api from "../lib/axios";

/**
 * Create a new list
 * POST /lists
 */
export const createList = (data: {
    name: string;
    organizationId?: string;
    customFields?: Record<string, any>;
}) => {
    return api.post("/lists", data);
};

/**
 * Get all lists
 * GET /lists
 */
export const getLists = () => {
    return api.get("/lists");
};

/**
 * Update a list
 * PUT /lists/:id
 */
export const updateList = (
    id: string,
    data: {
        name?: string;
        organizationId?: string;
        customFields?: Record<string, any>;
    }
) => {
    return api.put(`/lists/${id}`, data);
};

/**
 * Import subscribers via CSV
 * POST /lists/:listId/import-csv
 */
export const importListCSV = (listId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(`/lists/${listId}/import-csv`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const segmentSubscribers = (
    listId: string,
    filters: Record<string, any>
) => {
    return api.post(`/lists/${listId}/segment`, filters);
};
