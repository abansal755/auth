import User from "../../../models/User";
import bcrypt from "bcrypt";
import { access, refresh } from "../../../utils/encodeJwtToken";
import { v4 as uuidv4 } from "uuid";

export const controller = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password)
		return res.status(400).json({ message: "Invalid payload" });

	const user = await User.findOne({ username }).exec();
	let match = false;
	if (user) match = await bcrypt.compare(password, user.password);
	if (match) {
		const accessToken = await access(user);
		const refreshToken = await refresh(user, uuidv4());
		res.json({
			accessToken,
			refreshToken,
		});
	} else
		res.status(400).json({
			message: "Invalid combination of username and password",
		});
};
