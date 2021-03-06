const axios = require("axios")
const config = require("../utils/config")
const parser = require("fast-xml-parser")
const GameObject = require("../classes/Game")
const Game = require("../models/Game")
const Session = require("../models/Session")
const jwt = require("../middlewares/jwt")

const parseJSON = async xmlData => {
	const games = await Game.find({})
	const gameObjects = games.map(game => {
		return new GameObject(game.name, game.id, game)
	})

	const jsonObj = parser.parse(xmlData, { ignoreAttributes: false })
	const changePromises = Object.keys(jsonObj.items.item).map(async item => {
		const game = jsonObj.items.item[item]
		const gameID = game["@_objectid"]
		const rating = game.stats.rating["@_value"]
		if (rating === "N/A") {
			return null
		}
		const gameObject = await gameObjects.find(
			game => game.bgg === parseInt(gameID)
		)
		if (!(gameObject && gameObject.rating !== parseInt(rating))) {
			// Game not found or its rating is already correct; no change.
			return null
		}
		try {
			const updated = await Game.findOneAndUpdate(
				{ _id: gameObject.id },
				{ rating: rating },
				{ new: true }
			).exec()
			return `${updated.name}: ${gameObject.rating} -> ${updated.rating}`
		} catch (error) {
			console.log(error)
		}
	})

	const changes = (await Promise.all(changePromises)).filter(c => c)
	if (changes.length === 0) changes.push("No changes!")
	return changes
}

const getXMLData = async () => {
	const retry = (function() {
		let count = 0

		return async (max, timeout, next) => {
			const response = await axios.get(
				`https://www.boardgamegeek.com/xmlapi2/collection?username=${config.bggID}&stats=1`
			)
			if (response.status !== 200) {
				console.log(`Status: ${response.status}`)
				count += 1
				if (count < max) {
					return setTimeout(() => {
						retry(max, timeout, next)
					}, timeout)
				} else {
					return next(new Error("Max retries reached"))
				}
			}

			next(null, response.data)
		}
	})()

	await retry(20, 1000, (error, data) => {
		if (error) {
			ctx.throw(401, error)
		}
		xmlData = data
	})

	return xmlData
}

module.exports = ({ syncRouter }) => {
	syncRouter.get("/", jwt, async (ctx, next) => {
		if (!config.bggID) {
			ctx.throw(400, "No BGG ID specified.")
		}

		try {
			const changes = await parseJSON(await getXMLData())
			const result = JSON.stringify(changes.join("\n"))
			ctx.body = result
		} catch (err) {
			ctx.throw(400, err)
		}
	})

	syncRouter.get("/totalplays", jwt, async (ctx, next) => {
		const games = await Game.find({})
		const sessions = await Session.find({})

		const gameObjects = games.map(game => {
			return new GameObject(game.name, game.id, game)
		})

		for (var i = 0; i < sessions.length; i++) {
			const object = gameObjects.find(game => game.name === sessions[i].game)
			if (object) {
				object.addSession(sessions[i], false)
			}
			if (object.parent) {
				const parentObject = gameObjects.find(
					game => game.name === object.parent
				)
				if (parentObject) {
					parentObject.addSession(sessions[i], false)
					if (parentObject.parent) {
						const grandParentObject = gameObjects.find(
							game => game.name === parentObject.parent
						)
						if (grandParentObject) {
							grandParentObject.addSession(sessions[i], false)
						}
					}
				}
			}
		}

		const changePromises = Object.keys(gameObjects).map(async gameID => {
			const game = gameObjects[gameID]
			if (game.totalPlays === game.plays) return null
			try {
				const updated = await Game.findOneAndUpdate(
					{ _id: game.id },
					{ totalPlays: game.plays },
					{ new: true }
				).exec()
				return `${updated.name}: ${updated.plays} => ${updated.totalPlays}`
			} catch (error) {
				console.log(error)
			}
		})
		const changes = (await Promise.all(changePromises)).filter(c => c)
		if (changes.length === 0) changes.push("No changes!")
		const result = JSON.stringify(changes.join("\n"))
		ctx.body = result
	})
}
