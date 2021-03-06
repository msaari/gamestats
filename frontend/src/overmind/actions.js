export const setUser = ({ effects, state }, user) => {
	state.user = user
	window.localStorage.setItem("gamestatsLoggedUser", JSON.stringify(user))
	effects.sessions.setToken(user.token)
	effects.games.setToken(user.token)
	effects.sync.setToken(user.token)
}

export const setupUser = ({ actions }) => {
	const loggedUserJSON = window.localStorage.getItem("gamestatsLoggedUser")
	if (loggedUserJSON) {
		const user = JSON.parse(loggedUserJSON)
		actions.setUser(user)
	}
}

export const setSessionList = ({ state }, sessionList) => {
	state.sessionList = sessionList
}

export const deleteSession = ({ effects, state }, id) => {
	effects.sessions.deleteItem(id)
	const newSessionList = state.sessionList.filter(
		(session) => session.id !== id
	)
	state.sessionList = newSessionList
}

export const createSession = async ({ effects, state }, session) => {
	const newSession = await effects.sessions.create(session)
	const newSessionList = state.sessionList.concat([newSession])
	state.sessionList = newSessionList
}

export const updateGame = async ({ effects, state }, data) => {
	await effects.games.update(data.id, data.object)
	const updatedGame = await effects.games.getPath(`/id/${data.id}`)
	const newGameList = state.gameList.map((game) =>
		game.id === data.id ? updatedGame : game
	)
	state.gameList = newGameList
}

export const updateSession = async ({ effects, state }, data) => {
	const updatedSession = await effects.sessions.update(data.id, data.object)
	const newSessionList = state.sessionList.map((session) =>
		session.id === data.id ? updatedSession : session
	)
	state.sessionList = newSessionList
}

export const deleteGame = ({ effects, state }, id) => {
	effects.games.deleteItem(id)
	const newGameList = state.gameList.filter((game) => game.id !== id)
	state.gameList = newGameList
}

export const setupGameList = async ({ effects, state }, paramString) => {
	if (!state.isFetchingGames) {
		state.isFetchingGames = true
		state.gameList = await effects.games.getPath("", paramString)
		state.isFetchingGames = false
	}
}

export const setupSessionList = async ({ effects, state }, paramString) => {
	if (!state.isFetchingSessions) {
		state.isFetchingSessions = true
		state.sessionList = await effects.sessions.getPath("", paramString)
		state.isFetchingSessions = false
	}
}

export const getGameNames = async ({ effects, state }) => {
	if (!state.isFetchingNames) {
		state.isFetchingNames = true
		const games = await effects.games.getPath("gamenames")
		state.gameNames = games.map((game) => {
			return {
				label: game,
				value: game,
			}
		})
		state.gameNames.sort((a, b) => {
			if (a.label.toLowerCase() < b.label.toLowerCase()) return -1
			return 1
		})
		state.isFetchingNames = false
	}
}

export const getGameId = async ({ effects, state }, gameName) => {
	if (!state.isFetchingId[gameName]) {
		state.isFetchingId[gameName] = true
		const encodedName = encodeURIComponent(gameName)
		const game = await effects.games.getPath(`name/${encodedName}`)
		state.gameIds[gameName] = game.bgg
		state.isFetchingId[gameName] = false
	}
}

export const getBBCode = async ({ effects, state }, params) => {
	if (!state.isFetchingBBCode) {
		state.isFetchingBBCode = true
		params += "&order=rating&output=bbcode&plays=1&parents=0"
		const bbCode = await effects.games.getPath("", params)
		state.bbCode = bbCode
		state.isFetchingBBCode = false
	}
}

export const getFirstPlays = async ({ effects, state }) => {
	if (!state.isFetchingFirstPlays) {
		state.isFetchingFirstPlays = true
		const firstPlays = await effects.games.getPath("firstplays")
		state.firstPlays = firstPlays
		state.isFetchingFirstPlays = false
	}
}

export const getFiftyPlays = async ({ effects, state }) => {
	if (!state.isFetchingFiftyPlays) {
		state.isFetchingFiftyPlays = true
		const fiftyPlays = await effects.games.getPath("playgoal", "goal=50")
		state.fiftyPlays = fiftyPlays
		state.isFetchingFiftyPlays = false
	}
}

export const getMonthList = async ({ effects, state }) => {
	if (!state.isFetchingMonths) {
		state.isFetchingMonths = true
		state.monthList = await effects.timeperiods.getPath("months")
		state.isFetchingMonths = false
	}
}

export const getYearList = async ({ effects, state }) => {
	if (!state.isFetchingYears) {
		state.isFetchingYears = true
		state.yearList = await effects.timeperiods.getPath("years")
		state.isFetchingYears = false
	}
}

export const getSyncResults = async ({ effects, state }) => {
	if (!state.isSyncing) {
		state.isSyncing = true
		const syncResults = await effects.sync.getWithToken("")
		state.syncResults = syncResults
		state.isSyncing = false
	}
}

export const getSyncTotalsResults = async ({ effects, state }) => {
	if (!state.isSyncing) {
		state.isSyncing = true
		const syncResults = await effects.sync.getWithToken("totalplays")
		state.syncResults = syncResults
		state.isSyncing = false
	}
}

export const syncTotalPlays = ({ effects }) => {
	effects.sync.getWithToken("totalplays")
}

export const login = async ({ actions, effects }, credentials) => {
	const user = await effects.login.login(credentials)
	actions.setUser(user)
}
