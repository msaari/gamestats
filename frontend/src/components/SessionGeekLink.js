import React, { useState, useEffect } from "react"
import gameService from "../services/games"
import sessionService from "../services/sessions"
import AWN from "awesome-notifications"

const markSessionGeeked = async session => {
	const updatedSession = { ...session, ungeeked: false }
	try {
		sessionService.update(session.id, updatedSession)
		const notifier = new AWN()
		notifier.success("Session BGG flag cleared.")
	} catch (exception) {
		const notifier = new AWN()
		notifier.alert(`Could not clear the BGG flag: ${exception}`)
	}
}

const SessionGeekLink = ({ session }) => {
	const [gameId, setGameId] = useState("")

	useEffect(() => {
		let isSubscribed = true
		gameService.getByName(session.game).then(g => {
			if (isSubscribed) {
				setGameId(g.bgg)
			}
		})
		return () => (isSubscribed = false)
	}, [session.game])

	return (
		<a
			onClick={() => markSessionGeeked(session)}
			href={"https://www.boardgamegeek.com/boardgame/" + gameId + "/"}
		>
			BGG
		</a>
	)
}

export default SessionGeekLink
