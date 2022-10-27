import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import usePersistedState from "../hooks/usePersistedState";
import * as authService from "../services/Auth";

const AuthContext = createContext({});

export const useAuthContext = () => {
	return useContext(AuthContext);
};

const getTimeDiff = (accessToken) => {
	const now = new Date();
	const expiresAt = new Date(accessToken.expiresAt);
	return expiresAt.getTime() - now.getTime();
};

export const AuthContextProvider = (props) => {
	const { cachedState: accessToken, setCachedState: setAccessToken } =
		usePersistedState({ key: "access" });
	const { cachedState: refreshToken, setCachedState: setRefreshToken } =
		usePersistedState({ key: "refresh" });
	const [user, setUser] = useState(null);

	const resetStates = () => {
		setAccessToken(null);
		setRefreshToken(null);
		setUser(null);
	};

	const fetchNewTokens = async () => {
		try {
			const data = await authService.fetchNewTokens(refreshToken);
			setAccessToken(data.accessToken);
			setRefreshToken(data.refreshToken);
		} catch {
			resetStates();
		}
	};

	const fetchUser = async () => {
		try {
			const user = await authService.fetchUser(accessToken.token);
			setUser(user);
		} catch {
			resetStates();
		}
	};

	const login = async (username, password) => {
		try {
			const { accessToken, refreshToken } = await authService.login(
				username,
				password
			);
			setAccessToken(accessToken);
			setRefreshToken(refreshToken);
		} catch {}
	};

	const logout = () => {
		resetStates();
		authService.logout(refreshToken);
	};

	useEffect(() => {
		if (!accessToken) {
			if (refreshToken) fetchNewTokens();
			return;
		}
		if (!refreshToken) return resetStates();

		const timeDiff = getTimeDiff(accessToken);
		if (timeDiff <= 0) return fetchNewTokens();

		const id = setTimeout(() => {
			fetchNewTokens();
		}, timeDiff);

		if (!user) fetchUser();

		return () => clearTimeout(id);
	}, [accessToken, refreshToken, user]);

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
