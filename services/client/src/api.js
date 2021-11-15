import axios from "axios";

const userRequest = axios.create({
	baseURL: "http://localhost:1337",
	headers: { "Content-Type": "application/json" }
});

const jwtconfig = {
	headers: {
		Authorization: "Bearer " + localStorage.getItem("access_token")
	}
};

const uploadFileConfig = {
	headers: {
		Authorization: "Bearer " + localStorage.getItem("access_token"),
		"Content-Type": "multipart/form-data"
	}
};

const refreshConfig = {
	headers: {
		Authorization: "Bearer " + localStorage.getItem("refresh_token")
	}
};

console.log(localStorage.getItem("access_token"));

export const userLogin = data => userRequest.post("/api/login", data);
export const userLogout = () => userRequest.post("/api/logout", {}, jwtconfig);
export const registerUser = data => userRequest.post("/api/register", data);
export const getAllLang = () => userRequest.get("/api/getAllLang");
export const checkEmail = email =>
	userRequest.get("/api/checkEmail", { params: { email } });
export const checkUserName = username =>
	userRequest.get("/api/checkUserName", { params: { username } });
export const uploadPic = image =>
	axios.put("http://localhost:1337/api/uploadPic", image, uploadFileConfig);
export const tokenRefresh = () =>
	userRequest.get("/api/tokenRefresh", refreshConfig);
export const getMyProfile = () =>
	userRequest.get("/api/getMyProfile", jwtconfig);
export const getMyLangs = () => userRequest.get("/api/getMyLangs", jwtconfig);
export const editProfile = data =>
	userRequest.put("/api/editProfile", data, jwtconfig);
