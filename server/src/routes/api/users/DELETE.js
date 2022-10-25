import User from "../../../models/User";
import authorizeToken from "../../../middlewares/authorizeToken";

export const controller = async (req, res) => {
	const { user } = req;
	await User.findOneAndDelete({ username: user.username });
	res.json({ message: "Successfully deleted" });
};

export const middlewares = [authorizeToken];
