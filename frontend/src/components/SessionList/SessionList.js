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

	const handleDateChange = event => {
		event.preventDefault()
		const fromYear = event.target.fromYear.value
			? parseInt(event.target.fromYear.value)
			: now.year()
		const fromMonth = event.target.fromMonth.value
			? parseInt(event.target.fromMonth.value)
			: null
		const fromDay = event.target.fromDay.value
			? parseInt(event.target.fromDay.value)
			: null
		const toYear = event.target.toYear.value
			? parseInt(event.target.toYear.value)
			: now.year()
		const toMonth = event.target.toMonth.value
			? parseInt(event.target.toMonth.value)
			: null
		const toDay = event.target.toDay.value
			? parseInt(event.target.toDay.value)
			: null
		setDateParams({ fromDay, fromMonth, fromYear, toDay, toMonth, toYear })
	}

	const handleGameChange = event => {
		setGameParam(event.value)
	}

	const sessionsToShow = sessionList.map(entry => {
		return <Session key={entry.id} session={entry} isAuth={isAuth} />
	})

	return (
		<>
			<DateRange formHandler={handleDateChange} />
			<GameSelector changeHandler={handleGameChange} />
			<Container className="mt-4">{sessionsToShow}</Container>
		</>
	)
}

export default SessionList
