import React from "react"
import Session from "./Session"
import { useResource } from "../hooks/useResource"

const SessionList = props => {
	const [sessions, sessionService] = useResource("/api/sessions")

	const isAuth = props.user ? true : false

	const sessionsToShow = sessions.map(entry => {
		return (
			<Session
				key={entry.id}
				session={entry}
				isAuth={isAuth}
				sessions={sessions}
				service={sessionService}
			/>
		)
	})

	return <div>{sessionsToShow}</div>
}

export default SessionList
