import RefreshToken from "../../../models/RefreshToken";

export const controller = async (req, res) => {
	let { refreshToken } = req.body;
	if (!refreshToken)
		return res.status(400).json({ message: "Refresh token required" });

	const token = await RefreshToken.findOne({ token: refreshToken });
	if (!token)
		return res.status(400).json({ message: "Invalid refresh token" });

	await RefreshToken.findOneAndDelete({ token: refreshToken });
	res.json({ message: "Logged out" });
};
