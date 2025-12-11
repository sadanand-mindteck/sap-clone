import { apiClient } from "@/lib/axios";

export const qualityService = {
  getAllTests: async () => {
    const response = await apiClient.get("/quality");
    return response.data;
  },

  // New: Get history for a specific serial number
  getTestHistoryBySerial: async (serialNumber) => {
    const response = await apiClient.get(`/quality/history/${serialNumber}`);
    return response.data;
  },

  // Renamed to fit new structure, executes a single test record
  executeTest: async (data) => {
    const response = await apiClient.post("/quality/test", data);
    return response.data;
  },

  // New: Generate Note (NCR or Certificate)
  generateNote: async (data) => {
    const response = await apiClient.post("/quality/generate-note", data);
    return response.data;
  },

  getMachines: async () => {
    const response = await apiClient.get("/machines");
    return response.data;
  },

  // Deprecated shim if used elsewhere, redirects to executeTest
  createTest: async (data) => {
    return qualityService.executeTest(data);
  },
};
