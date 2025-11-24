import api from "./api";

export const loginUser = async (username, password) => {
  try {
    const response = await api.post("/v1/library/login", {
      username,
      password,
    });

    // Example: save token if successful
    if (response.data?.resources?.data?.token) {
      localStorage.setItem("token", response.data.resources.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Network Error" };
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/v1/library/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Forgot password error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Network Error" };
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get("/v1/library/profile");

    return response.data?.resources?.data; // return only data
  } catch (error) {
    console.error("Profile Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Network Error" };
  }
};
