import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken";
import config from "../config";
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, ACCESS_TOKEN_EXPIRE_AFTER } =
	config;

export const access = (user) => {
	const expiresAt = new Date();
	expiresAt.setSeconds(expiresAt.getSeconds() + ACCESS_TOKEN_EXPIRE_AFTER);

	return new Promise((resolve, reject) => {
		jwt.sign(
			{ username: user.username },
			JWT_ACCESS_SECRET,
			{ expiresIn: ACCESS_TOKEN_EXPIRE_AFTER },
			(err, token) => {
				if (err) reject(err);
				else
					resolve({
						token,
						expiresAt,
					});
			}
		);
	});
};

export const refresh = async (user) => {
	const token = await new Promise((resolve, reject) => {
		jwt.sign(
			{ username: user.username },
			JWT_REFRESH_SECRET,
			(err, token) => {
				if (err) reject(err);
				else resolve(token);
			}
		);
	});
	const refreshToken = new RefreshToken({ token });
	await refreshToken.save();
	return token;
};
