const Session = require("../models/Session")
const Game = require("../models/Game")
const jwt = require("../middlewares/jwt")

module.exports = ({ sessionsRouter }) => {
	sessionsRouter.get("/", async (ctx, next) => {
		let order = "asc"
		if (ctx.request.query.order === "desc") order = "desc"

		let params = {}

		let year = 0
		if (Number.isInteger(parseInt(ctx.request.query.year))) {
			year = parseInt(ctx.request.query.year)
		}
		let month = 0
		if (Number.isInteger(parseInt(ctx.request.query.month))) {
			month = parseInt(ctx.request.query.month)
		}
		if (year && month) {
			const toMonth = month === 12 ? 1 : month + 1
			const toYear = month === 1 ? year + 1 : year

			params = {
				...params,
				date: { $gte: `${year}-${month}-01`, $lt: `${toYear}-${toMonth}-01` }
			}
		} else if (year) {
			const toYear = year + 1

			params = {
				...params,
				date: { $gte: `${year}-01-01`, $lt: `${toYear}-01-01` }
			}
		}

		let game = null
		if (ctx.request.query.game) {
			params = {
				...params,
				game: ctx.request.query.game
			}
		}

		let limit = 0
		if (Number.isInteger(parseInt(ctx.request.query.limit)))
			limit = parseInt(ctx.request.query.limit)

		const sessions = await Session.find(params)
			.sort({ date: order })
			.limit(limit)

		ctx.body = sessions.map(s => s.toJSON())
	})

	sessionsRouter.get("/:id", async (ctx, next) => {
		const session = await Session.findOne({ _id: ctx.params.id })
		if (session !== null) {
			ctx.body = session
		} else {
			ctx.status = 404
			ctx.body = "Nothing found"
		}
	})

	sessionsRouter.post("/", jwt, async (ctx, next) => {
		const body = ctx.request.body

		console.log(body)

		if (!body.game) ctx.throw(400, "Game not specified.")
		if (!body.players) ctx.throw(400, "Players not specified.")
		if (!body.wins) ctx.throw(400, "Wins not specified.")
		if (!body.plays) ctx.throw(400, "Plays not specified.")
		if (!body.date) ctx.throw(400, "Date not specified.")

		const date = new Date(body.date).toISOString()

		const session = new Session({
			game: body.game,
			players: body.players,
			plays: body.plays,
			wins: body.wins,
			date: date,
			geek: false
		})

		const savedSession = await session.save()

		const gameInDB = await Game.findOne({ name: body.game })
		if (gameInDB === null) {
			const newGame = new Game({
				name: body.game
			})
			newGame.save()
		}

		ctx.status = 201
		ctx.body = savedSession
	})

	sessionsRouter.put("/:id", jwt, async (ctx, next) => {
		const body = ctx.request.body

		const session = {
			game: body.game,
			plays: body.plays,
			wins: body.wins,
			players: body.players,
			date: body.date
		}

		const updatedSession = await Session.findByIdAndUpdate(
			ctx.params.id,
			session,
			{ new: true }
		)
		ctx.body = updatedSession.toJSON()
	})

	sessionsRouter.delete("/:id", jwt, async (ctx, next) => {
		await Session.findOneAndDelete({ _id: ctx.params.id })
		ctx.status = 204
	})
}
