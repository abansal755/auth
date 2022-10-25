import axios from "axios";

const instance = axios.create({
	baseURL: process.env.REACT_APP_AUTH_URL || "http://localhost:3000",
});

export default instance;
