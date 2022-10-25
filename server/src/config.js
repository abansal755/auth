import { config as dotenv } from "dotenv";
dotenv();

const config = {
	PORT: 3000,
	DB_URL: "mongodb://localhost/auth-server",
	REFRESH_TOKEN_EXPIRE_AFTER: 1 * 30 * 24 * 60 * 60, // 30 days
	ACCESS_TOKEN_EXPIRE_AFTER: 10 * 60, // 10 mins
	JWT_ACCESS_SECRET: "secret",
	JWT_REFRESH_SECRET: "secret2",
};

for (const key in config) {
	if (process.env[key]) config[key] = process.env[key];
}

export default config;
