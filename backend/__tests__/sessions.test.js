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

describe("sessions", () => {
	test("get all sessions GET /api/sessions", async () => {
		const response = await request.get("/api/sessions")
		expect(response.status).toEqual(200)
		expect(response.body.length).toEqual(helper.initialSessions.length)
	})

	test("get all sessions in reverse date order GET /api/sessions?order=desc", async () => {
		const response = await request.get("/api/sessions?order=desc")
		expect(response.status).toEqual(200)
		expect(
			response.body.reduce(
				(memo, item) => memo && item.date <= memo && item.date
			)
		).toBeTruthy()
	})

	test("get all sessions for a year GET /api/sessions?year=2003", async () => {
		const sessionsIn2003 = helper.initialSessions.filter(
			s => s.date.getFullYear() === 2003
		)
		const response = await request.get("/api/sessions?year=2003")
		expect(response.status).toEqual(200)
		expect(response.body.length).toEqual(sessionsIn2003.length)
	})

	test("get all sessions for a year + month GET /api/sessions?year=2003&month=02", async () => {
		const sessionsIn2003 = helper.initialSessions.filter(
			s => s.date.getFullYear() === 2003 && s.date.getMonth() === 1
		)
		const response = await request.get("/api/sessions?year=2003&month=02")
		expect(response.status).toEqual(200)
		expect(response.body.length).toEqual(sessionsIn2003.length)
	})

	test("get all sessions for a game GET /api/sessions?game=Die+Macher", async () => {
		const sessionsForDieMacher = helper.initialSessions.filter(
			s => s.game === "Die Macher"
		)
		const response = await request.get("/api/sessions?game=Die+Macher")
		expect(response.status).toEqual(200)
		expect(response.body.length).toEqual(sessionsForDieMacher.length)
	})

	test("get all sessions for a game in year + month GET /api/sessions?game=Die+Macher&year=2003&month=02", async () => {
		const sessionsForDieMacherInFeb2003 = helper.initialSessions.filter(
			s =>
				s.game === "Die Macher" &&
				s.date.getFullYear() === 2003 &&
				s.date.getMonth() === 1
		)
		const response = await request.get(
			"/api/sessions?game=Die+Macher&year=2003&month=02"
		)
		expect(response.status).toEqual(200)
		expect(response.body.length).toEqual(sessionsForDieMacherInFeb2003.length)
	})

	test("get a single session GET /api/session/:id", async () => {
		const sessions = await helper.sessionsInDb()
		const expectedSession = sessions[0]
		expectedSession.id = expectedSession.id.toString()
		expectedSession.date = expectedSession.date.toISOString()

		const response = await request.get(`/api/sessions/${expectedSession.id}`)

		expect(response.status).toEqual(200)

		const receivedSession = response.body

		expect(receivedSession).toEqual(expectedSession)
	})

	test("add a new session for an existing game", async () => {
		const sessionsBefore = await helper.sessionsInDb()

		const newSession = {
			game: "Die Macher",
			date: new Date("2019-05-16T00:00:00.000+00:00"),
			plays: 1,
			wins: 1,
			players: 5,
			geek: false
		}

		await request
			.post("/api/sessions")
			.send(newSession)
			.expect(201)
			.expect("Content-Type", /application\/json/)

		const sessionsAfter = await helper.sessionsInDb()
		expect(sessionsAfter.length).toBe(sessionsBefore.length + 1)
	})

	test("add a new session for a new game", async () => {
		const sessionsBefore = await helper.sessionsInDb()
		const gamesBefore = await helper.gamesInDb()

		const newSession = {
			game: "Non-existing game",
			date: new Date("2019-05-16T00:00:00.000+00:00"),
			plays: 1,
			wins: 1,
			players: 5,
			geek: false
		}

		await request
			.post("/api/sessions")
			.send(newSession)
			.expect(201)
			.expect("Content-Type", /application\/json/)

		const sessionsAfter = await helper.sessionsInDb()
		expect(sessionsAfter.length).toBe(sessionsBefore.length + 1)

		const gamesAfter = await helper.gamesInDb()
		expect(gamesAfter.length).toBe(gamesBefore.length + 1)
	})

	test("remove a session DELETE /api/sessions/:id", async () => {
		const sessionsBefore = await helper.sessionsInDb()
		const deleteSession = sessionsBefore[0]

		await request.delete(`/api/sessions/${deleteSession.id}`).expect(204)

		const sessionsAfter = await helper.sessionsInDb()
		expect(sessionsAfter.length).toBe(sessionsBefore.length - 1)
	})

	test("remove a session with non-valid ID DELETE /api/sessions/:id", async () => {
		const sessionsBefore = await helper.sessionsInDb()
		await request.delete(`/api/sessions/123456789`).expect(400)

		const sessionsAfter = await helper.sessionsInDb()
		expect(sessionsAfter.length).toBe(sessionsBefore.length)
	})

	test("edit a session PUT /api/sessions/:id", async () => {
		const sessionsBefore = await helper.sessionsInDb()
		const sessionToUpdate = sessionsBefore[0]
		const updatedSession = {
			...sessionToUpdate,
			date: new Date("2019-05-19T11:00:00.000Z"),
			game: sessionToUpdate.game + " Jr"
		}

		await request
			.put(`/api/sessions/${sessionToUpdate.id}`)
			.send(updatedSession)

		const sessionsAfter = await helper.sessionsInDb()
		const updatedSessionFromDb = sessionsAfter.find(
			s => s.id.toString() === updatedSession.id.toString()
		)
		expect(updatedSessionFromDb).toEqual(updatedSession)
	})
})

afterAll(() => {
	mongoose.connection.close()
})
