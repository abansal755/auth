import { useState } from "react";
import { useAuthContext } from "./contexts/AuthContext";

export default () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const auth = useAuthContext();

	const formSubmitHandler = (e) => {
		e.preventDefault();
		auth.login(username, password);
	};

	if (auth.loggedIn) return <button onClick={auth.logout}>Logout</button>;
	else
		return (
			<form onSubmit={formSubmitHandler}>
				<input
					placeholder="username"
					value={username}
					onInput={(e) => setUsername(e.target.value)}
				/>
				<input
					placeholder="password"
					value={password}
					onInput={(e) => setPassword(e.target.value)}
				/>
				<button>Login</button>
			</form>
		);
};
