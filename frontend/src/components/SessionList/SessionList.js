import React, { useState, useEffect } from "react"
import moment from "moment"
import Session from "./Session/Session"
import DateRange from "../DateRange"
import GameSelector from "./GameSelector/GameSelector"
import Table from "react-bootstrap/Table"
import { useOvermind } from "../../overmind"

const dateParamString = dateParams => {
	let paramArray = []
	const to = moment(
		`${dateParams.toYear}-${dateParams.toMonth}-${dateParams.toDay}`,
		"YYYY-MM-DD"
	).add(1, "days")
	paramArray.push(
		`from=${dateParams.fromYear}-${dateParams.fromMonth}-${dateParams.fromDay}`
	)
	paramArray.push(`to=${to.format("YYYY-MM-DD")}`)
	return paramArray.join("&")
}

const SessionList = () => {
	const { state, actions } = useOvermind()

	const now = moment()

	const [dateParams, setDateParams] = useState({
		fromDay: now.startOf("month").format("D"),
		fromMonth: now.month() + 1,
		fromYear: now.year(),
		toDay: now.endOf("month").format("D"),
		toMonth: now.month() + 1,
		toYear: now.year()
	})
	const [gameParam, setGameParam] = useState("")
	const isAuth = state.user ? true : false

	let paramString = dateParamString(dateParams) + "&order=desc"
	if (gameParam)
		paramString = `game=${encodeURIComponent(gameParam)}&order=desc`

	useEffect(() => {
		actions.setupSessionList(paramString)
	}, [paramString, actions])

	const handleGameChange = event => {
		setGameParam(event.value)
	}

	const sessionsToShow = state.sessionList.map(entry => {
		return <Session key={entry.id} session={entry} isAuth={isAuth} />
	})

	return (
		<>
			<DateRange paramSetter={setDateParams} />
			<GameSelector changeHandler={handleGameChange} />
			<Table className="mt-4">
				<thead>
					<tr>
						<th>Date</th>
						<th>Game</th>
						<th>Plays</th>
						<th>Wins</th>
						<th>Players</th>
						{isAuth && <th>Tools</th>}
					</tr>
				</thead>
				<tbody>{sessionsToShow}</tbody>
			</Table>
		</>
	)
}

export default SessionList
