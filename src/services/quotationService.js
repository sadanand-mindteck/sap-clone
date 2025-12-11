import { apiClient } from "@/lib/axios";

export const quotationService = {
  getAll: async () => {
    const response = await apiClient.get("/quotations");
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post("/quotations", data);
    return response.data;
  },
};
