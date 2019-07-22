const Game = require("../models/Game")
const Session = require("../models/Session")

const initialGames = [
	{
		name: "Battle Line (Schotten-Totten)",
		designers: {
			0: "Reiner Knizia"
		},
		publisher: {
			0: "GMT Games"
		},
		year: 2000,
		owned: true,
		bgg: 760,
		rating: 8,
		length: 30
	},
	{
		name: "Die Macher",
		designers: {
			0: "Karl-Heinz Schmiel"
		},
		publisher: {
			0: "Hans im Glück"
		},
		year: 1997,
		owned: false,
		bgg: 1,
		rating: 6,
		length: 210
	},
	{
		name: "Catanin uudisasukkaat",
		designers: {
			0: "Klaus Teuber"
		},
		publisher: {
			0: "Kosmos",
			1: "Marektoy",
			2: "Lautapelit.fi"
		},
		year: 1995,
		owned: true,
		bgg: 13,
		rating: 8,
		length: 60
	}
]

const gamesInDb = async () => {
	const games = await Game.find({})
	return games.map(game => game.toJSON())
}

const initialSessions = [
	{
		game: "Battle Line (Schotten-Totten)",
		date: new Date("2001-05-16T00:00:00.000+00:00"),
		plays: 2,
		wins: 0,
		players: 2,
		geek: true
	},
	{
		game: "Die Macher",
		date: new Date("2003-02-22T00:00:00.000+00:00"),
		plays: 1,
		wins: 0,
		players: 4,
		geek: true
	},
	{
		game: "Die Macher",
		date: new Date("2003-03-22T00:00:00.000+00:00"),
		plays: 1,
		wins: 1,
		players: 4,
		geek: true
	},
	{
		game: "Catanin uudisasukkaat",
		date: new Date("2014-11-29T00:00:00.000+00:00"),
		plays: 1,
		wins: 0,
		players: 4,
		geek: true
	}
]

const sessionsInDb = async () => {
	const sessions = await Session.find({})
	return sessions.map(session => session.toJSON())
}

const nonExistingId = async () => {
	const session = new Session({
		game: "Catanin uudisasukkaat",
		date: 14172192123456,
		plays: 2,
		wins: 1,
		players: 5,
		geek: true
	})
	await session.save()
	await session.remove()

	return session._id.toString()
}

module.exports = {
	initialGames,
	gamesInDb,
	initialSessions,
	sessionsInDb,
	nonExistingId
}
