import RefreshToken from "../../../models/RefreshToken";
import { refresh } from "../../../utils/decodeJwtToken";
import { access } from "../../../utils/encodeJwtToken";

export const controller = async (req, res) => {
	let { refreshToken } = req.body;
	if (!refreshToken)
		return res.status(400).json({ message: "Refresh token required" });

	const token = await RefreshToken.findOne({ token: refreshToken });
	if (!token)
		return res.status(400).json({ message: "Invalid refresh token" });

	const user = await refresh(refreshToken);
	const accessToken = await access(user);

	res.json({ accessToken });
};
