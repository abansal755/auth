import authorizeToken from "../../../middlewares/authorizeToken";

export const controller = (req, res) => {
	res.json({
		username: req.user.username,
	});
};

export const middlewares = [authorizeToken];
