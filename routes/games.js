const GameObject = require("../classes/Game")
const Game = require("../models/Game")
const Session = require("../models/Session")
const jwt = require("../middlewares/jwt")

function calculateYears(moment) {
	var ageDifMs = Date.now() - moment.getTime()
	var ageDate = new Date(ageDifMs)
	return Math.abs(ageDate.getUTCFullYear() - 1970)
}

module.exports = ({ gamesRouter }) => {
	gamesRouter.get("/", async (ctx, next) => {
		let order = "name"
		if (ctx.request.query.order === "plays") order = "plays"

		const games = await Game.find({})
		const sessions = await Session.find({})

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
				if (parentObject.parent) {
					const grandParentObject = gameObjects.find(
						game => game.name === parentObject.parent
					)
					if (grandParentObject) {
						grandParentObject.addSession(sessions[i].plays, sessions[i].wins)
					}
				}
			}
		}
		switch (order) {
			case "plays":
				gameObjects.sort((a, b) => b.plays - a.plays)
				break
			case "name":
				gameObjects.sort((a, b) => {
					if (a.name < b.name) return -1
					return 1
				})
				break
		}

		ctx.body = gameObjects
	})

	gamesRouter.get("/top100", async (ctx, next) => {
		let order = "name"
		if (ctx.request.query.order === "plays") order = "plays"

		const games = await Game.find({})
		const sessions = await Session.find({})

		const gameObjects = games.map(game => {
			return new GameObject(game.name, game.id, game)
		})

		for (var i = 0; i < sessions.length; i++) {
			if (calculateYears(sessions[i].date) > 2) continue
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

		gamesRouter.get("/:id", async (ctx, next) => {
			const game = await Game.findOne({ _id: ctx.params.id })
			if (game !== null) {
				ctx.body = game
			} else {
				ctx.status = 404
				ctx.body = "Nothing found"
			}
		})

		const filteredGames = gameObjects.filter(
			game => game.plays > 0 && game.rating >= 8 && game.parent === undefined
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
		}

		ctx.body = filteredGames
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
		if (body.length) game.length = parseInt(body.length)

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
			length: body.length
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
