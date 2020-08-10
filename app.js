const Koa = require("koa")
const bodyParser = require("koa-bodyparser")
const Router = require("koa-router")
const logger = require("koa-logger")
const serve = require("koa-static")
const mongoose = require("mongoose")
const config = require("./utils/config")

const mongoUrl = config.mongoUrl
mongoose.set("useFindAndModify", false)
mongoose.set("useUnifiedTopology", true)
mongoose.connect(mongoUrl, { useNewUrlParser: true })

const app = new Koa()
app.use(serve(__dirname + "/frontend/build"))
app.use(bodyParser())
app.use(logger())

app.use(async (ctx, next) => {
	try {
		await next()
	} catch (err) {
		ctx.status = err.status || 500
		ctx.body = err.message
		ctx.app.emit("error", err, ctx)
	}
})

app.on("error", (err, ctx) => {
	if (err.name === "CastError") {
		ctx.status = 400
	} else {
		console.error(err)
	}
})

const router = new Router({
	prefix: "/api",
})

const gamesRouter = new Router({
	prefix: "/api/games",
})

const sessionsRouter = new Router({
	prefix: "/api/sessions",
})

const timePeriodsRouter = new Router({
	prefix: "/api/timeperiods",
})

const loginRouter = new Router({
	prefix: "/api/login",
})

const syncRouter = new Router({
	prefix: "/api/sync",
})

require("./routes/basic")({ router })
require("./routes/games")({ gamesRouter })
require("./routes/sessions")({ sessionsRouter })
require("./routes/login")({ loginRouter })
require("./routes/sync")({ syncRouter })
require("./routes/timeperiods")({ timePeriodsRouter })

app.use(router.routes())
app.use(router.allowedMethods())

app.use(gamesRouter.routes())
app.use(gamesRouter.allowedMethods())

app.use(sessionsRouter.routes())
app.use(sessionsRouter.allowedMethods())

app.use(timePeriodsRouter.routes())
app.use(timePeriodsRouter.allowedMethods())

app.use(loginRouter.routes())
app.use(loginRouter.allowedMethods())

app.use(syncRouter.routes())
app.use(syncRouter.allowedMethods())

if (!module.parent) app.listen(config.port)

module.exports = app
