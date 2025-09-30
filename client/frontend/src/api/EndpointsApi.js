
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

export const apiCreateSessionFretebras = async (page, disable = false) => {
  const response = await api.get(`/fretebras/session/${page}/disable=${disable}`);
  return response.data;
};


export const apiGetTruckersFretebras = async (freightId) => {
  const response = await api.get(`/fretebras/freights/${freightId}/truckers`, { withCredentials: true });
  return response.data;
};

export const apiCreateFrete = async (data) => {
  const response = await api.post("/frete/create", data, { withCredentials: true });
  return response.data;
}

export const apiGetUsers = async () => {
  const response = await api.get("/users/all", { withCredentials: true });
  return response.data;
};


export const apiCreateUser = async (data) => {
  const response = await api.post("/users/create", data, { withCredentials: true });
  return response.data;
};


export const apiUpdateUser = async (email, data) => {
  const response = await api.put(`/users/${email}`, data, { withCredentials: true });
  return response.data;
};

export const apiDeleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`, { withCredentials: true });
  return response.data;
};

export const apiGetAllFretes = async () => {
  const response = await api.get("/fretes", { withCredentials: true });
  return response.data;
}

export const apiSendMessageToTrucker = async (freightId, truckerIds) => {
  const response = await api.post("/fretes/message", { freightId, truckerIds }, { withCredentials: true });
  return response.data;
};