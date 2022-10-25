import fs from "fs";
import path from "path";
import url from "url";
import wrapAsync from "./utils/wrapAsync";

const _getAllFiles = (dir, list) => {
	const files = fs.readdirSync(dir, { withFileTypes: true });
	for (const file of files) {
		if (file.isFile()) list.push(path.join(dir, file.name));
		else _getAllFiles(path.join(dir, file.name), list);
	}
};

const getAllFiles = (dir) => {
	const list = [];
	_getAllFiles(dir, list);
	return list;
};

export default async (app) => {
	const __filename = url.fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const routesDir = path.join(__dirname, "routes");

	const routeFiles = getAllFiles(routesDir);
	for (const routeFilePath of routeFiles) {
		let route = path
			.dirname(path.relative(routesDir, routeFilePath))
			.replace("\\", "/");
		if (route === ".") route = "";
		route = "/" + route;

		const method = path.basename(routeFilePath, ".js");

		const { controller, middlewares = [] } = await import(
			`file://${routeFilePath}`
		);

		app[method.toLowerCase()](
			route,
			...middlewares.map((middleware) => wrapAsync(middleware)),
			wrapAsync(controller)
		);
	}
};
