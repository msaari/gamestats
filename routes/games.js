const Game = require("../models/Game")
const jwt = require("../middlewares/jwt")
const dates = require("../utils/dates")
const bbCodify = require("../utils/bbcodify")
const getGameObjects = require("../utils/getGameObjects")
const dayjs = require("dayjs")

const redis = require("async-redis")
const redisClient = redis.createClient(process.env.REDIS_URL)
const md5 = require("md5")

var redisAvailable = false

redisClient.on("ready", function(err) {
	redisAvailable = true
})
redisClient.on("error", function(err) {
	redisAvailable = false
})

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

		const targetYear = ctx.request.query.to
			? ctx.request.query.to.substring(0, ctx.request.query.to.indexOf("-"))
			: new Date().getFullYear()

		const countForParents = ctx.request.query.parents === "0" ? false : true

		const key = md5(
			"getgames" +
				JSON.stringify(sessionParams) +
				JSON.stringify(countForParents) +
				JSON.stringify(ctx.request.query.output)
		)

		const redisGames = redisAvailable ? await redisClient.get(key) : null
		const games = redisGames
			? JSON.parse(redisGames)
			: sortGames(
					queryFiltering(
						await getGameObjects(
							sessionParams,
							false,
							countForParents,
							targetYear
						),
						ctx.request.query
					),
					ctx.request.query
			  )

		switch (ctx.request.query.output) {
			case "bbcode":
				if (redisAvailable)
					redisClient
						.set(key, JSON.stringify(games))
						.catch(error => console.log("redis error", error))
				ctx.body = JSON.stringify(bbCodify(games))
				break
			default:
				if (redisAvailable)
					redisClient
						.set(key, JSON.stringify(games))
						.catch(error => console.log("redis error", error))
				ctx.body = games
		}
	})

	gamesRouter.get("/gamenames", async (ctx, next) => {
		const redisGames = redisAvailable
			? await redisClient.get("gamenames")
			: null
		if (redisGames) {
			ctx.body = JSON.parse(redisGames)
		} else {
			const games = await Game.find({})
			const gameNames = games.map(game => game.name)
			if (redisAvailable)
				redisClient
					.set("gamenames", JSON.stringify(gameNames))
					.catch(error => console.log("redis error", error))
			ctx.body = gameNames
		}
	})

	gamesRouter.get("/firstplays", async (ctx, next) => {
		let sessionParams = {}
		let dateParam = dates.readDateParam(ctx.request.query)
		if (dateParam) sessionParams = dateParam

		const countForParents = ctx.request.query.parents === "0" ? false : true
		const key = md5(
			"firstplays" +
				JSON.stringify(sessionParams) +
				JSON.stringify(countForParents) +
				JSON.stringify(ctx.request.query.output)
		)

		const redisPlays = redisAvailable ? await redisClient.get(key) : null
		if (redisPlays) {
			ctx.body = JSON.parse(redisPlays)
		} else {
			const games = queryFiltering(
				await getGameObjects(sessionParams, true, countForParents),
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

			if (redisAvailable)
				redisClient
					.set(key, JSON.stringify(gamesPlays))
					.catch(error => console.log("redis error", error))

			ctx.body = gamesPlays
		}
	})

	gamesRouter.get("/playgoal", async (ctx, next) => {
		let sessionParams = {}
		let dateParam = dates.readDateParam(ctx.request.query)
		if (dateParam) sessionParams = dateParam
		let goal = 50
		if (!isNaN(parseInt(ctx.request.query.goal)))
			goal = parseInt(ctx.request.query.goal)
		const bubbleLimit = goal - 10 > 0 ? goal - 10 : 0

		const countForParents = ctx.request.query.parents === "0" ? false : true

		const key = md5(
			"playgoal" +
				JSON.stringify(sessionParams) +
				JSON.stringify(countForParents) +
				JSON.stringify(goal)
		)

		const redisPlays = redisAvailable ? await redisClient.get(key) : null
		if (redisPlays) {
			ctx.body = JSON.parse(redisPlays)
		} else {
			const games = queryFiltering(
				await getGameObjects(sessionParams, true, countForParents),
				ctx.request.query
			)
			const gamesPlays = games
				.filter(game => game.plays > bubbleLimit)
				.map(game => {
					game.sessions.sort((a, b) => a.date - b.date)

					const firstPlayDate = game.sessions.reduce(
						(date, session) => (session.date < date ? session.date : date),
						Date.now()
					)
					const goalPlayDate = game.sessions.reduce(
						(datePlays, session) => {
							datePlays.plays += session.plays
							if (datePlays.plays >= goal && !datePlays.reachedGoal) {
								datePlays.date = session.date
								datePlays.reachedGoal = true
							}
							return datePlays
						},
						{ date: 0, plays: 0, reachedGoal: false }
					)
					const firstMoment = dayjs(firstPlayDate)
					const lastMoment = dayjs(goalPlayDate.date)
					const differenceInDays = goalPlayDate.date
						? lastMoment.diff(firstMoment, "days")
						: 0
					return firstPlayDate && goalPlayDate
						? {
								game: game.name,
								plays: game.plays,
								firstPlayDate,
								goalPlayDate: goalPlayDate.date,
								differenceInDays
						  }
						: null
				})

			gamesPlays.sort((a, b) => a.goalPlayDate - b.goalPlayDate)

			if (redisAvailable)
				redisClient
					.set(key, JSON.stringify(gamesPlays))
					.catch(error => console.log("redis error", error))

			ctx.body = gamesPlays
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

		if (redisAvailable)
			redisClient.flushall().catch(error => console.log("redis error", error))

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

		if (redisAvailable)
			redisClient.flushall().catch(error => console.log("redis error", error))

		ctx.body = updatedGame.toJSON()
	})

	gamesRouter.delete("/:id", jwt, async (ctx, next) => {
		await Game.findOneAndDelete({ _id: ctx.params.id })

		if (redisAvailable)
			redisClient.flushall().catch(error => console.log("redis error", error))

		ctx.status = 204
	})
}
