import api from "../api/api";

export const getApplications = () =>
    api.get("/applications");

export const getApplicationById = (id) =>
    api.get(`/applications/${id}`);

export const createApplication = (data) =>
    api.post("/applications", data);

export const updateApplication = (id, data) =>
    api.put(`/applications/${id}`, data);

export const deleteApplication = (id) =>
    api.delete(`/applications/${id}`);

export const submitApplication = (id) =>
    api.post(`/applications/${id}/submit`);

export const approveApplication = (id, remarks) =>
    api.post(`/applications/${id}/approve`, null, {
        params: { remarks }
    });

export const rejectApplication = (id, remarks) =>
    api.post(`/applications/${id}/reject`, null, {
        params: { remarks }
    });