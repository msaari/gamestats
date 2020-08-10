const Session = require("../models/Session")
const Game = require("../models/Game")
const jwt = require("../middlewares/jwt")
const dates = require("../utils/dates")
const moment = require("moment")

const redis = require("async-redis")
const redisClient = redis.createClient(process.env.REDIS_URL)
const md5 = require("md5")

var redisAvailable = false

redisClient.on("ready", function (err) {
	redisAvailable = true
})
redisClient.on("error", function (err) {
	redisAvailable = false
})

function escapeRegExp(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

module.exports = ({ timePeriodsRouter }) => {
	timePeriodsRouter.get("/months", async (ctx, next) => {
		let key = md5("getallgameobjects")

		const redisGames = redisAvailable ? await redisClient.get(key) : null
		const games = redisGames ? JSON.parse(redisGames) : await Game.find({})

		if (redisAvailable)
			redisClient
				.set(key, JSON.stringify(games))
				.catch((error) => console.log("redis error", error))
		key = md5("getallsessions")

		const redisSessions = redisAvailable ? await redisClient.get(key) : null
		const sessions = redisSessions
			? JSON.parse(redisSessions)
			: await Session.find({})

		if (redisAvailable)
			redisClient
				.set(key, JSON.stringify(sessions))
				.catch((error) => console.log("redis error", error))

		let months = []

		for (const session of sessions) {
			const sessionDate = moment(session.date)
			if (sessionDate.format("YYYY-MM-DD") === "2001-01-01") continue
			let month = months.find((m) => m.name == sessionDate.format("YYYY-MM"))
			if (!month) {
				month = {}
				month.name = sessionDate.format("YYYY-MM")
				month.plays = 0
				month.totalPlayers = 0
				month.totalLength = 0
				months.push(month)
			}
			const game = games.find((g) => g.name == session.game)
			month.plays = month.plays + session.plays
			month.totalPlayers = month.totalPlayers + session.plays * session.players
			month.totalLength = month.totalLength + session.plays * game["length"]
			months = months.map((m) => {
				if (m.name === month.name) {
					m = month
				}
				return m
			})
		}
		months = months.map((m) => {
			m.avgPlayers = m.totalPlayers / m.plays
			return m
		})

		ctx.body = months
	})

	timePeriodsRouter.get("/years", async (ctx, next) => {
		let key = md5("getallgameobjects")

		const redisGames = redisAvailable ? await redisClient.get(key) : null
		const games = redisGames ? JSON.parse(redisGames) : await Game.find({})

		if (redisAvailable)
			redisClient
				.set(key, JSON.stringify(games))
				.catch((error) => console.log("redis error", error))
		key = md5("getallsessions")

		const redisSessions = redisAvailable ? await redisClient.get(key) : null
		const sessions = redisSessions
			? JSON.parse(redisSessions)
			: await Session.find({})

		if (redisAvailable)
			redisClient
				.set(key, JSON.stringify(sessions))
				.catch((error) => console.log("redis error", error))

		let years = []

		for (const session of sessions) {
			const sessionDate = moment(session.date)
			if (sessionDate.format("YYYY-MM-DD") === "2001-01-01") continue
			let year = years.find((m) => m.name == sessionDate.format("YYYY"))
			if (!year) {
				year = {}
				year.name = sessionDate.format("YYYY")
				year.plays = 0
				year.totalPlayers = 0
				year.totalLength = 0
				years.push(year)
			}
			const game = games.find((g) => g.name == session.game)
			year.plays = year.plays + session.plays
			year.totalPlayers = year.totalPlayers + session.plays * session.players
			year.totalLength = year.totalLength + session.plays * game["length"]
			years = years.map((m) => {
				if (m.name === year.name) {
					m = year
				}
				return m
			})
		}
		years = years.map((m) => {
			m.avgPlayers = m.totalPlayers / m.plays
			return m
		})

		ctx.body = years
	})
}
