import User from "../../../models/User";
import hashPassword from "../../../utils/hashPassword";
import { access, refresh } from "../../../utils/encodeJwtToken";
import { v4 as uuidv4 } from "uuid";

export const controller = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password)
		return res.status(400).json({ message: "Invalid payload" });

	let user = await User.findOne({ username }).exec();
	if (user)
		return res.status(400).json({
			message: "A user with the provided username already exists",
		});

	const hash = await hashPassword(password);
	user = new User({
		username,
		password: hash,
	});
	await user.save();

	const accessToken = await access(user);
	const refreshToken = await refresh(user, uuidv4());
	res.json({ accessToken, refreshToken });
};
