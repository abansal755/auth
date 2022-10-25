import express from "express";
import mongoose from "mongoose";
import config from "./config";
const { PORT, DB_URL } = config;
import registerRoutes from "./registerRoutes";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "*");
	next();
});

(async () => {
	await registerRoutes(app);

	app.use((err, req, res, next) => {
		res.status(500).json({
			message: err.message || "Something went wrong",
		});
	});
})();

app.listen(PORT, () => console.log(`Listening to PORT ${PORT}`));

(async () => {
	await mongoose.connect(DB_URL);
	console.log("MongoDB running");
})();
