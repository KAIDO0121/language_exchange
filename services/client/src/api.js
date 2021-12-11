import axios from "axios";

const authRequests = ["logout", "getMyProfile", "getMyLangs", "editProfile"];

const CancelToken = axios.CancelToken;

const baseURL = "http://sean-services.link/";

const userRequest = axios.create({
  baseURL,
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
  if (_url === "getUserLangs" || _url === "getUserProfile") {
    const isnum = /^\d+$/.test(config.params.id);
    if (!isnum) {
      return {
        ...config,
        cancelToken: new CancelToken((cancel) =>
          cancel("Request cancelled due to invalid id params")
        ),
      };
    }
  }
  if (_url === "tokenRefresh") {
    config.headers.Authorization =
      "Bearer " + localStorage.getItem("refresh_token");
  }
  return config;
});

userRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { data } = await tokenRefresh();
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + data.access_token;
      return userRequest(originalRequest);
    }
    return Promise.reject(error);
  }
);

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
export const getUserLangs = (id) =>
  userRequest.get("/api/getUserLangs", { params: { id } });
export const editProfile = (data) => userRequest.put("/api/editProfile", data);
export const getUserProfile = (id) =>
  userRequest.get("/api/getUserProfile", { params: { id } });

export const matchUserByLang = (queryLangs) =>
  userRequest.post("/api/matchUserByLang", queryLangs);
