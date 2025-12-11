import { apiClient } from "@/lib/axios";

export const salesService = {
  getAll: async () => {
    const response = await apiClient.get("/sales");
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post("/sales", data);
    return response.data;
  },
};
