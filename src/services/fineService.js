import api from "./api";

export const getFineReasons = async () => {
    try {
        const response = await api.get("/v1/library/fine-reasons")
        return response.data?.resources?.data || [];
    } catch (error) {
        console.error("❌ Error fetching fine reasons:", error);
        throw error;
    }
}

export const imposeFine = async (payload) => {
    try {
        const response = await api.post("/v1/library/fines", payload);
        return response.data;
    } catch (error) {
        console.error("❌ Error imposing fine:", error);
        throw error.response?.data || { message: "Failed to impose fine" };
    }
}

export const getAllFines = async (params ) => {
    try {
        const response = await api.get("/v1/library/fines", { params });
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching fines:", error);
        throw error.response?.data || { message: "Failed to fetch fines" };
    }
}

export const updateFine = async (fine_id, payload) => {
    try {
        const response = await api.put(`/v1/library/fines/${fine_id}`, payload);
        return response.data;
    } catch (error) {
        console.error("❌ Error updating fine:", error);
        throw error.response?.data || { message: "Failed to update fine" };
    }
}