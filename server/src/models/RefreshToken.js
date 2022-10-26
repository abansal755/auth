import mongoose from "mongoose";
import config from "../config";
const { REFRESH_TOKEN_EXPIRE_AFTER } = config;

const refreshTokenSchema = new mongoose.Schema({
	token: {
		type: String,
		required: true,
	},
	family: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: () => new Date(),
	},
});

refreshTokenSchema.index(
	{ createdAt: 1 },
	{ expireAfterSeconds: REFRESH_TOKEN_EXPIRE_AFTER }
);

export default mongoose.model("RefreshToken", refreshTokenSchema);

mongoose.model("RefreshToken").ensureIndexes((err) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}
});
