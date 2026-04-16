import axios from "axios";

const api = axios.create({ baseURL: "https://phish.encryptbytes.com/api" });

export const analyseSubmission = async (formData) =>
  api.post("/analyse", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const getFindings = async () => api.get("/findings");
export const getTaxonomy = async () => api.get("/taxonomy");
export const getStats = async () => api.get("/stats");
