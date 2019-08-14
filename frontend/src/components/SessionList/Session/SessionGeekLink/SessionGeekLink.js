import React, { useEffect } from "react"
import AWN from "awesome-notifications"
import { useOvermind } from "../../../../overmind"

const SessionGeekLink = ({ session }) => {
	const { state, actions } = useOvermind()

	const markSessionGeeked = async session => {
		const updatedSession = { ...session, ungeeked: false }
		try {
			actions.updateSession({ id: session.id, object: updatedSession })
			const notifier = new AWN()
			notifier.success("Session BGG flag cleared.")
		} catch (exception) {
			const notifier = new AWN()
			notifier.alert(`Could not clear the BGG flag: ${exception}`)
		}
	}

	useEffect(() => {
		if (!state.gameIds[session.game]) actions.getGameId(session.game)
	}, [session.game, state.gameIds, actions])

	const gameId = state.gameIds[session.game]

	const href = gameId
		? "https://www.boardgamegeek.com/boardgame/" + gameId + "/"
		: null

	const onClick = gameId ? () => markSessionGeeked(session) : null

	const style = gameId ? null : { color: "#aaaaaa" }
	return (
		<a style={style} onClick={onClick} href={href}>
			(BGG)
		</a>
	)
}

export default SessionGeekLink
