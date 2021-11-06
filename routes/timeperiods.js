const Session = require("../models/Session")
const Game = require("../models/Game")
const jwt = require("../middlewares/jwt")
const dates = require("../utils/dates")
const dayjs = require("dayjs")

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

// Creates the data for the timeperiods page
async function createTimePeriodsData(type) {
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

	let data = []

	for (const session of sessions) {
		const sessionDate = dayjs(session.date)
		if (sessionDate.format("YYYY-MM-DD") === "2001-01-01") continue

		const format = type == 'month' ? "YYYY-MM" : "YYYY"
		let period = null
		period = data.find((p) => p.name == sessionDate.format(format))
		if (!period) {
			period = {}
			period.name = sessionDate.format(format)
			period.plays = 0
			period.totalPlayers = 0
			period.totalLength = 0
			period.games = new Set()
			data.push(period)
		}
		const game = games.find((g) => g.name == session.game)
		period.plays = period.plays + session.plays
		period.totalPlayers = period.totalPlayers + session.plays * session.players
		period.totalLength = period.totalLength + session.plays * game["length"]
		period.games.add(game["name"])
		data = data.map((p) => {
			if (p.name === period.name) {
				p = period
			}
			return p
		})
	}
	data = data.map((p) => {
		p.avgPlayers = p.totalPlayers / p.plays
		p.totalGames = p.games.size
		p.games = null
		return p
	})

	return data
}

module.exports = ({ timePeriodsRouter }) => {
	timePeriodsRouter.get("/months", async (ctx, next) => {
		ctx.body = await createTimePeriodsData("month")
	})

	timePeriodsRouter.get("/years", async (ctx, next) => {
		ctx.body = await createTimePeriodsData("year")
	})
}
