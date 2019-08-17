const GameObject = require("../classes/Game")
const Game = require("../models/Game")
const Session = require("../models/Session")
const jwt = require("../middlewares/jwt")
const dates = require("../utils/dates")

function escapeRegExp(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

const bbCodify = games => {
	const output = games.reduce((result, game) => {
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
	return output
}

module.exports = ({ gamesRouter }) => {
	gamesRouter.get("/", async (ctx, next) => {
		const validOrders = ["name", "plays", "rating"]
		let order = "name"
		if (validOrders.indexOf(ctx.request.query.order))
			order = ctx.request.query.order

		let sessionParams = {}
		let dateParam = dates.readDateParam(ctx.request.query)
		if (dateParam) sessionParams = dateParam

		const games = await Game.find({})
		const sessions = await Session.find(sessionParams)

		const gameObjects = games.map(game => {
			return new GameObject(game.name, game.id, game)
		})

		for (var i = 0; i < sessions.length; i++) {
			const object = gameObjects.find(game => game.name === sessions[i].game)
			if (object) {
				object.addSession(sessions[i].plays, sessions[i].wins)
				if (object.parent) {
					const parentObject = gameObjects.find(
						game => game.name === object.parent
					)
					if (parentObject) {
						parentObject.addSession(sessions[i].plays, sessions[i].wins)
						if (parentObject.parent) {
							const grandParentObject = gameObjects.find(
								game => game.name === parentObject.parent
							)
							if (grandParentObject) {
								grandParentObject.addSession(
									sessions[i].plays,
									sessions[i].wins
								)
							}
						}
					}
				}
			}
		}

		let filteredGames = gameObjects
		if (ctx.request.query.plays && !isNaN(parseInt(ctx.request.query.plays)))
			filteredGames = filteredGames.filter(
				game => game.plays >= parseInt(ctx.request.query.plays)
			)
		if (ctx.request.query.noexpansions)
			filteredGames = filteredGames.filter(game => !game.parent)
		if (ctx.request.query.rating && !isNaN(parseInt(ctx.request.query.rating)))
			filteredGames = filteredGames.filter(
				game => game.rating >= parseInt(ctx.request.query.rating)
			)

		switch (order) {
			case "plays":
				filteredGames.sort((a, b) => b.plays - a.plays)
				break
			case "name":
				filteredGames.sort((a, b) => {
					if (a.name < b.name) return -1
					return 1
				})
				break
			case "rating":
				filteredGames.sort((a, b) => b.rating - a.rating)
				break
		}

		switch (ctx.request.query.output) {
			case "bbcode":
				ctx.body = JSON.stringify(bbCodify(filteredGames))
				break
			default:
				ctx.body = filteredGames
		}
	})

	gamesRouter.get("/name/:name", async (ctx, next) => {
		const game = await Game.findOne({
			name: new RegExp(`^${escapeRegExp(ctx.params.name)}$`, "i")
		})
		if (game !== null) {
			ctx.body = game
		} else {
			ctx.status = 404
			ctx.body = "Nothing found"
		}
	})

	gamesRouter.get("/:id", async (ctx, next) => {
		const game = await Game.findOne({ _id: ctx.params.id })
		if (game !== null) {
			ctx.body = game
		} else {
			ctx.status = 404
			ctx.body = "Nothing found"
		}
	})

	gamesRouter.post("/", jwt, async (ctx, next) => {
		const body = ctx.request.body

		if (!body.name) ctx.throw(400, "Name not specified.")

		const game = new Game({
			game: body.game
		})

		if (body.designers) game.designers = body.designers
		if (body.publisher) game.publisher = body.publisher
		if (body.year) game.year = parseInt(body.year)
		game.owned = body.owned ? true : false
		if (body.bgg) game.bgg = parseInt(body.bgg)
		if (body.rating) game.rating = parseInt(body.rating)
		if (body.gameLength) game.length = parseInt(body.gameLength)
		if (body.parent) game.parent = body.parent

		const savedGame = await game.save()

		const gameInDB = await Game.findOne({ name: body.game })
		if (gameInDB === null) {
			const newGame = new Game({
				name: body.game
			})
			newGame.save()
		}

		ctx.status = 201
		ctx.body = savedGame
	})

	gamesRouter.put("/:id", jwt, async (ctx, next) => {
		const body = ctx.request.body

		const game = {
			name: body.name,
			designers: body.designers,
			publisher: body.publisher,
			year: body.year,
			owned: body.owned,
			bgg: body.bgg,
			rating: body.rating,
			length: body.gameLength,
			parent: body.parent
		}

		const updatedGame = await Game.findByIdAndUpdate(ctx.params.id, game, {
			new: true
		})
		ctx.body = updatedGame.toJSON()
	})

	gamesRouter.delete("/:id", jwt, async (ctx, next) => {
		await Game.findOneAndDelete({ _id: ctx.params.id })
		ctx.status = 204
	})
}
