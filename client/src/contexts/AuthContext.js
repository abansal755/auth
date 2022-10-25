import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import axios from "../lib/axios";

const AuthContext = createContext({});

export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = (props) => {
	const [accessToken, setAccessToken] = useState(
		JSON.parse(localStorage.getItem("access"))
	);
	const [refreshToken, setRefreshToken] = useState(
		localStorage.getItem("refresh")
	);
	const [user, setUser] = useState(null);

	const resetStates = () => {
		setAccessToken(null);
		setRefreshToken(null);
		setUser(null);
		localStorage.clear();
	};

	const fetchNewAccessToken = async () => {
		try {
			const { data } = await axios.post("/api/token", {
				refreshToken,
			});

			setAccessToken(data.accessToken);
			localStorage.setItem("access", JSON.stringify(data.accessToken));
		} catch {
			// delete refresh token
			resetStates();
		}
	};

	useEffect(() => {
		(async () => {
			if (!accessToken) {
				if (refreshToken) fetchNewAccessToken();
				return;
			}
			if (!refreshToken) {
				setAccessToken(null);
				localStorage.removeItem("access");
				return;
			}
			const now = new Date();
			const expiresAt = new Date(accessToken.expiresAt);
			if (now >= expiresAt) return fetchNewAccessToken();

			const timeDiff = expiresAt.getTime() - now.getTime();
			setTimeout(() => {
				fetchNewAccessToken();
			}, timeDiff);

			try {
				const { data } = await axios.get("/api/users", {
					headers: {
						Authorization: `Bearer ${accessToken.token}`,
					},
				});

				setUser(data);
			} catch {
				resetStates();
			}
		})();
	}, [accessToken]);

	const login = async (username, password) => {
		try {
			const { data } = await axios.post("/api/login", {
				username,
				password,
			});
			const { accessToken, refreshToken } = data;

			setAccessToken(accessToken);
			localStorage.setItem("access", JSON.stringify(accessToken));

			setRefreshToken(refreshToken);
			localStorage.setItem("refresh", refreshToken);
		} catch {}
	};

	const logout = async () => {
		try {
			await axios.post("/api/logout", {
				refreshToken,
			});
		} catch {}
		setAccessToken(null);
		setRefreshToken(null);
		setUser(null);
		localStorage.clear();
	};

	return (
		<AuthContext.Provider
			value={{
				accessToken,
				refreshToken,
				user,
				isLoggedIn: !!user,
				login,
				logout,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};
