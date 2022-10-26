import RefreshToken from "../../../models/RefreshToken";
import { refresh as decodeRefresh } from "../../../utils/decodeJwtToken";
import {
	access as encodeAccess,
	refresh as encodeRefresh,
} from "../../../utils/encodeJwtToken";
import User from "../../../models/User";

export const controller = async (req, res) => {
	let { refreshToken } = req.body;
	if (!refreshToken)
		return res.status(400).json({ message: "Refresh token required" });

	const user = await decodeRefresh(refreshToken);
	const userInDb = await User.findOne({ username: user.username });
	if (!userInDb)
		return res.status(400).json({ message: "Invalid refresh token" });

	const token = await RefreshToken.findOne({ token: refreshToken });
	if (!token) {
		// using invalidated refresh token => delete all refresh tokens of the family
		await RefreshToken.deleteMany({ family: user.family });
		return res.status(400).json({ message: "Invalid refresh token" });
	}

	const accessToken = await encodeAccess(user);

	await RefreshToken.findOneAndDelete({ token: refreshToken });
	const newRefreshToken = await encodeRefresh(user, user.family);

	res.json({
		accessToken,
		refreshToken: newRefreshToken,
	});
};
