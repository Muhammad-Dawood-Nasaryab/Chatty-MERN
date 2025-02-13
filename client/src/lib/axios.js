import axios from "axios";

export const fetchServer = axios.create({
	baseURL: "http://localhost:8000/api",
	withCredentials: true,
});
