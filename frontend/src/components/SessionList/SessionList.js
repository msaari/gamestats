import React, { useState, useEffect } from "react"
import Session from "./Session/Session"
import sessionService from "../../services/sessions"
import DateRange from "../DateRange"
import moment from "moment"

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
	const isAuth = props.user ? true : false

	useEffect(() => {
		sessionService
			.getPath("", dateParamString(dateParams) + "&order=desc")
			.then(sessions => {
				setSessionList(sessions)
			})
	}, [dateParams])

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

	const sessionsToShow = sessionList.map(entry => {
		return <Session key={entry.id} session={entry} isAuth={isAuth} />
	})

	return (
		<>
			<DateRange formHandler={handleDateChange} />
			<div>{sessionsToShow}</div>
		</>
	)
}

export default SessionList
