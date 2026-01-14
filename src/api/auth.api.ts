import api from "../lib/axios";

export const loginApi = (data: {
    email: string;
    password: string;
}) => api.post("/auth/login", data);

export const registerApi = (data: {
    fullName: string;
    email: string;
    password: string;
    organizationName: string
}) => api.post("/users/register", data);
