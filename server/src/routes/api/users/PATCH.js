import { access } from "../../../utils/encodeJwtToken";
import User from "../../../models/User";
import hashPassword from "../../../utils/hashPassword";
import authorizeToken from "../../../middlewares/authorizeToken";

export const controller = async (req, res) => {
	const { user } = req;

	const { username, password } = req.body;
	if (!username || !password)
		return res.status(400).json({ message: "No changes found" });

	if (username) {
		let user2 = await User.findOne({ username });
		if (user2)
			return res.status(400).json({ message: "Username already in use" });
		user.username = username;
	}
	if (password) {
		const hash = await hashPassword(password);
		user.password = hash;
	}
	await user.save();

	const newToken = await access(user);
	res.json({ accessToken: newToken });
};

export const middlewares = [authorizeToken];
