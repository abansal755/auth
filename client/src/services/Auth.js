import axios from "../lib/axios";

export const fetchNewTokens = async (refreshToken) => {
	const { data } = await axios.post("/api/token", {
		refreshToken,
	});
	return data;
};

export const fetchUser = async (accessToken) => {
	const { data } = await axios.get("/api/users", {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return data;
};

export const login = async (username, password) => {
	const { data } = await axios.post("/api/login", {
		username,
		password,
	});
	return data;
};

export const logout = (refreshToken) => {
	return axios.post("/api/logout", {
		refreshToken,
	});
};
