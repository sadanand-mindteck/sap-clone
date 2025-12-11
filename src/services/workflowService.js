import { apiClient } from "@/lib/axios";

export const workflowService = {
  getApprovals: async () => {
    const response = await apiClient.get("/workflow/approvals");
    return response.data;
  },
  getNotings: async (fileId) => {
    const response = await apiClient.get(`/workflow/notings/${fileId}`);
    return response.data;
  },
  addNoting: async (fileId, text, action) => {
    const response = await apiClient.post("/workflow/notings", { fileId, text, action });
    return response.data;
  },
  // Scrutiny
  getFCL: async () => {
    const response = await apiClient.get("/scrutiny/fcl");
    return response.data;
  },
  getFCM: async () => {
    const response = await apiClient.get("/scrutiny/fcm");
    return response.data;
  },
};
