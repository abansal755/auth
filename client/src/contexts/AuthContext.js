import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import usePersistedState from "../hooks/usePersistedState";
import {
	fetchNewTokens as fetchNewTokensService,
	fetchUser as fetchUserService,
	login as loginService,
	logout as logoutService,
} from "../services/Auth";

const AuthContext = createContext({});

export const useAuthContext = () => {
	return useContext(AuthContext);
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

	const fetchNewAccessToken = async () => {
		try {
			const data = await fetchNewTokensService(refreshToken);
			setAccessToken(data.accessToken);
			setRefreshToken(data.refreshToken);
		} catch {
			resetStates();
		}
	};

	const fetchUser = async () => {
		try {
			const user = await fetchUserService(accessToken.token);
			setUser(user);
		} catch {
			resetStates();
		}
	};

	const login = async (username, password) => {
		try {
			const { accessToken, refreshToken } = await loginService(
				username,
				password
			);
			setAccessToken(accessToken);
			setRefreshToken(refreshToken);
		} catch {}
	};

	const logout = async () => {
		resetStates();
		logoutService(refreshToken);
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

			if (!user) fetchUser();
		})();
	}, [accessToken]);

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
