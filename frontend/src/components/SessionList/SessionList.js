import React, { useState, useEffect } from "react"
import moment from "moment"
import Session from "./Session/Session"
import DateRange from "../DateRange"
import GameSelector from "./GameSelector/GameSelector"
import sessionService from "../../services/sessions"
import Container from "react-bootstrap/Container"

const dateParamString = dateParams => {
	let paramArray = []
	paramArray.push(
		`from=${dateParams.fromYear}-${dateParams.fromMonth}-${dateParams.fromDay}`
	)
	paramArray.push(
		`to=${dateParams.toYear}-${dateParams.toMonth}-${dateParams.toDay}`
	)
	return paramArray.join("&")
}

const SessionList = props => {
	const now = moment()

	const [sessionList, setSessionList] = useState([])
	const [dateParams, setDateParams] = useState({
		fromDay: now.startOf("month").format("D"),
		fromMonth: now.month() + 1,
		fromYear: now.year(),
		toDay: now.endOf("month").format("D"),
		toMonth: now.month() + 1,
		toYear: now.year()
	})
	const [gameParam, setGameParam] = useState("")
	const isAuth = props.user ? true : false

	useEffect(() => {
		let paramString = dateParamString(dateParams) + "&order=desc"
		if (gameParam)
			paramString = `game=${encodeURIComponent(gameParam)}&order=desc`
		sessionService.getPath("", paramString).then(sessions => {
			setSessionList(sessions)
		})
	}, [dateParams, gameParam])

	const handleGameChange = event => {
		setGameParam(event.value)
	}

	const sessionsToShow = sessionList.map(entry => {
		return <Session key={entry.id} session={entry} isAuth={isAuth} />
	})

	return (
		<>
			<DateRange paramSetter={setDateParams} />
			<GameSelector changeHandler={handleGameChange} />
			<Container className="mt-4">{sessionsToShow}</Container>
		</>
	)
}

export default SessionList
