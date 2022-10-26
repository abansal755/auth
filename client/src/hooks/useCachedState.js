import { useState } from "react";

const defaultSerialize = (data) => {
	return JSON.stringify(data);
};

const defaultDeserialize = (data) => {
	return JSON.parse(data);
};

const useCachedState = ({
	serialize = defaultSerialize,
	deserialize = defaultDeserialize,
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

export default useCachedState;
