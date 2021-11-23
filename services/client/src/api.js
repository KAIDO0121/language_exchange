import axios from "axios";

const authRequests = ["logout", "getMyProfile", "getMyLangs", "editProfile"];

const userRequest = axios.create({
  baseURL: "http://localhost:1337",
  headers: { "Content-Type": "application/json" },
});

userRequest.interceptors.request.use((config) => {
  const str = config.url.split("/");

  const _url = str[str.length - 1];

  if (authRequests.includes(_url)) {
    if (!localStorage.getItem("access_token")) return;
    config.headers.Authorization =
      "Bearer " + localStorage.getItem("access_token");
  }
  if (_url === "uploadPic") {
    config.headers.Authorization =
      "Bearer " + localStorage.getItem("access_token");
    config.headers["Content-Type"] = "multipart/form-data";
  }
  if (_url === "tokenRefresh") {
    config.headers.Authorization =
      "Bearer " + localStorage.getItem("refresh_token");
  }
  return config;
});

export const userLogin = (data) => userRequest.post("/api/login", data);
export const userLogout = () => userRequest.post("/api/logout", {});
export const registerUser = (data) => userRequest.post("/api/register", data);
export const getAllLang = () => userRequest.get("/api/getAllLang");
export const checkEmail = (email) =>
  userRequest.get("/api/checkEmail", { params: { email } });
export const checkUserName = (username) =>
  userRequest.get("/api/checkUserName", { params: { username } });
export const uploadPic = (image) => userRequest.put("/api/uploadPic", image);
export const tokenRefresh = () => userRequest.get("/api/tokenRefresh");
export const getMyProfile = () => userRequest.get("/api/getMyProfile");
export const getMyLangs = () => userRequest.get("/api/getMyLangs");
export const editProfile = (data) => userRequest.put("/api/editProfile", data);

export const matchUserByLang = (queryLangs) =>
  userRequest.post("/api/matchUserByLang", queryLangs);
