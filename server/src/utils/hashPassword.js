import bcrypt from "bcrypt";

const saltRounds = 10;

export default (password) => {
	return bcrypt.hash(password, saltRounds);
};
