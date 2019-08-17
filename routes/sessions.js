const Session = require("../models/Session")
const Game = require("../models/Game")
const jwt = require("../middlewares/jwt")
const dates = require("../utils/dates")

module.exports = ({ sessionsRouter }) => {
	sessionsRouter.get("/", async (ctx, next) => {
		let order = "asc"
		if (ctx.request.query.order === "desc") order = "desc"

		let params = {}

		let dateParam = dates.readDateParam(ctx.request.query)
		if (dateParam) params = dateParam

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

		if (!body.game) ctx.throw(400, "Game not specified.")
		if (!body.players) ctx.throw(400, "Players not specified.")
		if (!body.wins) body.wins = 0
		if (!body.plays) ctx.throw(400, "Plays not specified.")
		if (!body.date) ctx.throw(400, "Date not specified.")

		const date = new Date(body.date).toISOString()

		const session = new Session({
			game: body.game,
			players: body.players,
			plays: body.plays,
			wins: body.wins,
			date: date,
			ungeeked: true
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
			date: body.date,
			ungeeked: body.ungeeked
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
