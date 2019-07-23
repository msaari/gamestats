const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/User")

module.exports = ({ loginRouter }) => {
	loginRouter.post("/", async (ctx, next) => {
		const body = ctx.request.body
		const user = await User.findOne({ username: body.username })

		const passwordCorrect =
			user === null ? false : await bcrypt.compare(body.password, user.password)

		if (!(user && passwordCorrect)) {
			ctx.throw(401, "Invalid username or password")
		}

		const userForToken = {
			username: user.username,
			id: user._id
		}

		const token = jwt.sign(userForToken, process.env.SECRET)

		ctx.status = 200
		ctx.body = { token, username: user.username, name: user.name }
	})
}
