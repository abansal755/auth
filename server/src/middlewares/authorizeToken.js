import User from "../models/User";
import { access } from "../utils/decodeJwtToken";

export default async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader)
		return res
			.status(400)
			.json({ message: "Authorization header not found" });
	const token = authHeader.split(" ")[1];

	let user = await access(token);
	user = await User.findOne({ username: user.username });
	if (!user) return res.status(400).json({ message: "User not found" });
	req.user = user;
	next();
};
