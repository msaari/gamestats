const koaJwt = require("koa-jwt")

module.exports = koaJwt({
	secret: process.env.SECRET
})
