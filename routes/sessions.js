const Session = require("../models/Session")
const Game = require("../models/Game")
const GameObject = require("../classes/Game")
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

	sessionsRouter.get("/bbcode/", async (ctx, next) => {
		order = "rating"
		if (ctx.request.query.order === "name") order = "name"

		let params = {}

		let dateParam = dates.readDateParam(ctx.request.query)
		if (dateParam) params = dateParam

		const games = await Game.find({})
		const sessions = await Session.find(params)

		const gameObjects = games.map(game => {
			return new GameObject(game.name, game.id, game)
		})

		for (var i = 0; i < sessions.length; i++) {
			const object = gameObjects.find(game => game.name === sessions[i].game)
			if (object) {
				object.addSession(sessions[i].plays, sessions[i].wins)
			}
			if (object.parent) {
				const parentObject = gameObjects.find(
					game => game.name === object.parent
				)
				if (parentObject) {
					parentObject.addSession(sessions[i].plays, sessions[i].wins)
				}
			}
		}

		const filteredGames = gameObjects.filter(
			game => game.plays > 0 && !game.parent
		)

		switch (order) {
			case "rating":
				filteredGames.sort((a, b) => b.rating - a.rating)
				break
			case "name":
				filteredGames.sort((a, b) => {
					if (a.name < b.name) return -1
					return 1
				})
				break
		}

		const output = filteredGames.reduce((result, game) => {
			let text = ""
			switch (game.rating) {
				case 10:
					text =
						"[b][bgcolor=#00cc00][color=#00cc00].[/color][color=#000000]10[/color][color=#00cc00]![/color][/bgcolor][/b]"
					break
				case 9:
					text =
						"[b][bgcolor=#33cc99][color=#33cc99]_[/color][color=#000000]9[/color][color=#33cc99]_[/color][/bgcolor][/b]"
					break
				case 8:
					text =
						"[b][bgcolor=#66ff99][color=#66ff99]_[/color][color=#000000]8[/color][color=#66ff99]_[/color][/bgcolor][/b]"
					break
				case 7:
					text =
						"[b][bgcolor=#99ffff][color=#99ffff]_[/color][color=#000000]7[/color][color=#99ffff]_[/color][/bgcolor][/b]"
					break
				case 6:
					text =
						"[b][bgcolor=#9999ff][color=#9999ff]_[/color][color=#000000]6[/color][color=#9999ff]_[/color][/bgcolor][/b]"
					break
				case 5:
					text =
						"[b][bgcolor=#cc99ff][color=#cc99ff]_[/color][color=#000000]5[/color][color=#cc99ff]_[/color][/bgcolor][/b]"
					break
				case 4:
					text =
						"[b][bgcolor=#ff66cc][color=#ff66cc]_[/color][color=#000000]4[/color][color=#ff66cc]_[/color][/bgcolor][/b]"
					break
				case 3:
					text =
						"[b][bgcolor=#ff6699][color=#ff6699]_[/color][color=#000000]3[/color][color=#ff6699]_[/color][/bgcolor][/b]"
					break
				case 2:
					text =
						"[b][bgcolor=#ff3366][color=#ff3366]_[/color][color=#000000]2[/color][color=#ff3366]_[/color][/bgcolor][/b]"
					break
				default:
					text = ""
			}
			result += `${game.plays} × ${text} ${game.name}\n`
			return result
		}, "")

		ctx.body = JSON.stringify(output)
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
