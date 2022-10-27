import { useState } from "react";

const usePersistedState = ({
	serialize = JSON.stringify,
	deserialize = JSON.parse,
	key,
}) => {
	const [data, setData] = useState(deserialize(localStorage.getItem(key)));

	const setCachedState = (data) => {
		setData(data);
		if (data !== null && data !== undefined)
			localStorage.setItem(key, serialize(data));
		else localStorage.removeItem(key);
	};

	const clearCache = () => {
		localStorage.removeItem(key);
	};

	return {
		cachedState: data,
		setCachedState,
		clearCache,
	};
};

export default usePersistedState;
