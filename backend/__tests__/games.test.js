const app = require("../app.js")
const request = require("supertest").agent(app.listen())
const helper = require("../utils/test_helper")
const Session = require("../models/Session")
const Game = require("../models/Game")
const mongoose = require("mongoose")

beforeAll(async () => {
	await Game.deleteMany({})

	const gameObjects = helper.initialGames.map(g => new Game(g))
	const gameArray = gameObjects.map(g => g.save())
	await Promise.all(gameArray)

	await Session.deleteMany({})

	const sessionObjects = helper.initialSessions.map(s => new Session(s))
	const promiseArray = sessionObjects.map(s => s.save())
	await Promise.all(promiseArray)
})

describe("games", () => {
	test("get all games GET /api/games", async () => {
		const response = await request.get("/api/games")
		expect(response.status).toEqual(200)
		expect(response.body.length).toEqual(helper.initialGames.length)
	})

	test("get all games in reverse order of games played GET /api/games?order=plays", async () => {
		const response = await request.get("/api/games?order=plays")
		expect(response.status).toEqual(200)
		expect(
			response.body.reduce(
				(memo, item) => memo && item.plays <= memo && item.plays,
				Number.MAX_SAFE_INTEGER
			)
		).toBeTruthy()
	})

	test("get a single game GET /api/games/:id", async () => {
		const games = await helper.gamesInDb()
		const expectedGame = games[0]
		expectedGame.id = expectedGame.id.toString()
		const response = await request.get(`/api/games/${expectedGame.id}`)

		expect(response.status).toEqual(200)

		const receivedGame = response.body

		expect(receivedGame).toEqual(expectedGame)
	})

	test("add a new game with just a name", async () => {
		const gamesBefore = await helper.gamesInDb()

		const newGame = {
			name: "A Feast for Odin"
		}

		await request
			.post("/api/games")
			.send(newGame)
			.expect(201)
			.expect("Content-Type", /application\/json/)

		const gamesAfter = await helper.gamesInDb()
		expect(gamesAfter.length).toBe(gamesBefore.length + 1)
	})

	test("add a new game with complete data", async () => {
		const gamesBefore = await helper.gamesInDb()

		const newGame = {
			name: "A Feast for Odin",
			designers: {
				0: "Uwe Rosenberg"
			},
			publisher: {
				0: "Feuerland Spiele",
				1: "Z-Man Games"
			},
			year: 2016,
			owned: true,
			bgg: 177736,
			rating: 9,
			length: 90
		}

		await request
			.post("/api/games")
			.send(newGame)
			.expect(201)
			.expect("Content-Type", /application\/json/)

		const gamesAfter = await helper.gamesInDb()
		expect(gamesAfter.length).toBe(gamesBefore.length + 1)
	})

	test("remove a game DELETE /api/games/:id", async () => {
		const gamesBefore = await helper.gamesInDb()
		const deleteGame = gamesBefore[0]

		await request.delete(`/api/games/${deleteGame.id}`).expect(204)

		const gamesAfter = await helper.gamesInDb()
		expect(gamesAfter.length).toBe(gamesBefore.length - 1)
	})

	test("remove a game with non-valid ID DELETE /api/games/:id", async () => {
		const gamesBefore = await helper.gamesInDb()
		await request.delete(`/api/games/123456789`).expect(400)

		const gamesAfter = await helper.gamesInDb()
		expect(gamesAfter.length).toBe(gamesBefore.length)
	})

	test("edit a game PUT /api/games/:id", async () => {
		const gamesBefore = await helper.gamesInDb()
		const gameToUpdate = gamesBefore[0]
		const updatedGame = {
			...gameToUpdate,
			name: gameToUpdate.name + " Jr"
		}

		await request
			.put(`/api/games/${gameToUpdate.id}`)
			.send(updatedGame)
			.expect(200)

		const gamesAfter = await helper.gamesInDb()
		const updatedGameFromDb = gamesAfter.find(
			s => s.id.toString() === updatedGame.id.toString()
		)
		expect(updatedGameFromDb).toEqual(updatedGame)
	})
})

afterAll(() => {
	mongoose.connection.close()
})
