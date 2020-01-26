const Session = require("../models/Session")
const Game = require("../models/Game")
const GameObject = require("../classes/Game")

module.exports = async (
	sessionParams,
	includeSessions,
	countForParents = true,
	targetYear = new Date().getFullYear()
) => {
	const games = await Game.find({})
	const sessions = await Session.find(sessionParams)

	const gameObjects = games.map(game => {
		return new GameObject(game.name, game.id, game)
	})

	for (var i = 0; i < sessions.length; i++) {
		const object = gameObjects.find(game => game.name === sessions[i].game)
		if (object) {
			object.addSession(sessions[i], includeSessions)
			if (object.parent && countForParents) {
				const parentObject = gameObjects.find(
					game => game.name === object.parent
				)
				if (parentObject) {
					parentObject.addSession(sessions[i], includeSessions)
					if (parentObject.parent) {
						const grandParentObject = gameObjects.find(
							game => game.name === parentObject.parent
						)
						if (grandParentObject) {
							grandParentObject.addSession(sessions[i], includeSessions)
						}
					}
				}
			}
		}
	}

	console.log(targetYear)
	gameObjects.forEach(game => game.updateStayingPower(2001, targetYear))

	return gameObjects
}
