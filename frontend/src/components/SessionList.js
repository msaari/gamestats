import React, { useState, useEffect } from "react"
import Session from "./Session"
import sessionService from "../services/sessions"

const SessionList = props => {
	const [sessionList, setSessionList] = useState([])

	const isAuth = props.user ? true : false

	useEffect(() => {
		sessionService.getSome(20).then(sessions => {
			setSessionList(sessions)
		})
	}, [])

	const sessionsToShow = sessionList.map(entry => {
		return <Session key={entry.id} session={entry} isAuth={isAuth} />
	})

	return <div>{sessionsToShow}</div>
}

export default SessionList
