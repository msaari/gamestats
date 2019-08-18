const Game = require("../models/Game")
const jwt = require("../middlewares/jwt")
const dates = require("../utils/dates")
const bbCodify = require("../utils/bbcodify")
const getGameObjects = require("../utils/getGameObjects")

function escapeRegExp(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

const queryFiltering = (games, query) => {
	if (query.plays && !isNaN(parseInt(query.plays)))
		games = games.filter(game => game.plays >= parseInt(query.plays))
	if (query.noexpansions) games = games.filter(game => !game.parent)
	if (query.rating && !isNaN(parseInt(query.rating)))
		games = games.filter(game => game.rating >= parseInt(query.rating))

	return games
}

const sortGames = (games, query) => {
	const validOrders = ["name", "plays", "rating"]
	let order = "name"
	if (validOrders.indexOf(query.order)) order = query.order

	switch (order) {
		case "plays":
			games.sort((a, b) => b.plays - a.plays)
			break
		case "name":
			games.sort((a, b) => {
				if (a.name < b.name) return -1
				return 1
			})
			break
		case "rating":
			games.sort((a, b) => b.rating - a.rating)
			break
	}
	return games
}

module.exports = ({ gamesRouter }) => {
	gamesRouter.get("/", async (ctx, next) => {
		let sessionParams = {}
		let dateParam = dates.readDateParam(ctx.request.query)
		if (dateParam) sessionParams = dateParam

		const games = sortGames(
			queryFiltering(
				await getGameObjects(sessionParams, false),
				ctx.request.query
			),
			ctx.request.query
		)

		switch (ctx.request.query.output) {
			case "bbcode":
				ctx.body = JSON.stringify(bbCodify(games))
				break
			default:
				ctx.body = games
		}
	})

	gamesRouter.get("/firstplays", async (ctx, next) => {
		let sessionParams = {}
		let dateParam = dates.readDateParam(ctx.request.query)
		if (dateParam) sessionParams = dateParam

		const games = queryFiltering(
			await getGameObjects(sessionParams, true),
			ctx.request.query
		)
		const gamesPlays = games
			.filter(game => game.plays > 0)
			.map(game => {
				const firstPlayDate = game.sessions.reduce((date, session) => {
					return session.date < date ? session.date : date
				}, Date.now())
				return firstPlayDate ? { game: game.name, date: firstPlayDate } : null
			})

		gamesPlays.sort((a, b) => a.date - b.date)

		ctx.body = gamesPlays
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
