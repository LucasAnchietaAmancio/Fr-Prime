
import api from "./BaseApi";

export const apiLogin = async (email,senha) => {
  const response = await api.post("/signin", {email,senha});
  return response.data;
};

export const apiVerifyToken = async () => {
  const response = await api.get("/private-route");
  return response;
};

export const apiLogout = async () => {
  const response = await api.get("/logout");
  return response.data;
}

export const apiCreateSessionFretebras = async () => {
  const response = await api.get("/fretebras/session");
  return response.data;
}


export const apiGetTruckersFretebras = async (freightId) => {
  const response = await api.get(`/fretebras/freights/${freightId}/truckers`, { withCredentials: true });
  return response.data;
};