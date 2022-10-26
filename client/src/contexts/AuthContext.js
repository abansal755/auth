import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import axios from "../lib/axios";
import useCachedState from "../hooks/useCachedState";

const AuthContext = createContext({});

export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = (props) => {
	const { cachedState: accessToken, setCachedState: setAccessToken } =
		useCachedState({ key: "access" });
	const { cachedState: refreshToken, setCachedState: setRefreshToken } =
		useCachedState({ key: "refresh" });
	const [user, setUser] = useState(null);

	const resetStates = () => {
		setAccessToken(null);
		setRefreshToken(null);
		setUser(null);
	};

	const fetchNewAccessToken = async () => {
		try {
			const { data } = await axios.post("/api/token", { refreshToken });
			setAccessToken(data.accessToken);
			setRefreshToken(data.refreshToken);
		} catch {
			resetStates();
		}
	};

	useEffect(() => {
		(async () => {
			if (!accessToken) {
				if (refreshToken) fetchNewAccessToken();
				return;
			}
			if (!refreshToken) return resetStates();
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
			setRefreshToken(refreshToken);
		} catch {}
	};

	const logout = async () => {
		try {
			await axios.post("/api/logout", { refreshToken });
		} catch {}
		resetStates();
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
