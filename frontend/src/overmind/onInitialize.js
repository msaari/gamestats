export const onInitialize = async ({ state, effects }) => {
	effects.sync.initialize()
	effects.games.initialize()
	effects.sessions.initialize()
}

export default onInitialize
