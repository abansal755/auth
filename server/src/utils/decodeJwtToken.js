import jwt from "jsonwebtoken";
import config from "../config";
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = config;

export const access = async (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, JWT_ACCESS_SECRET, (err, user) => {
			if (err) reject(err);
			else resolve(user);
		});
	});
};

export const refresh = async (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, JWT_REFRESH_SECRET, (err, user) => {
			if (err) reject(err);
			else resolve(user);
		});
	});
};
