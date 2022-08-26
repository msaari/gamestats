import React, { useState, useEffect } from "react"
import dayjs from "dayjs"
import Session from "./Session/Session"
import DateRange from "../DateRange"
import GameSelector from "./GameSelector/GameSelector"
import SessionChart from "./SessionChart/SessionChart"
import Table from "react-bootstrap/Table"
import { useActions, useAppState } from "../../overmind"

const dateParamString = (dateParams) => {
	let paramArray = []
	const to = dayjs(
		`${dateParams.toYear}-${dateParams.toMonth}-${dateParams.toDay}`,
		"YYYY-MM-DD"
	).add(1, "days")
	paramArray.push(
		`from=${dateParams.fromYear}-${dateParams.fromMonth}-${dateParams.fromDay}`
	)
	paramArray.push(`to=${to.format("YYYY-MM-DD")}`)
	return paramArray.join("&")
}

const sumTotalSessions = (sessions) => {
	const totals = {
		plays: 0,
		wins: 0,
		players: 0,
	}

	sessions.forEach((session) => {
		totals.plays += parseInt(session.plays)
		totals.wins += parseInt(session.wins)
		totals.players += parseInt(session.players) * parseInt(session.plays)
	})
	totals.average = totals.plays
		? Math.round((totals.players / totals.plays) * 10) / 10
		: 0

	return (
		<tr>
			<td>&nbsp;</td>
			<td>Total</td>
			<td>{totals.plays}</td>
			<td>{totals.wins}</td>
			<td>{totals.average}</td>
			<td>&nbsp;</td>
		</tr>
	)
}

const SessionList = () => {
	const actions = useActions()
	const state = useAppState()

	const now = dayjs()

	const [dateParams, setDateParams] = useState({
		fromDay: now.startOf("month").format("D"),
		fromMonth: now.month() + 1,
		fromYear: now.year(),
		toDay: now.endOf("month").format("D"),
		toMonth: now.month() + 1,
		toYear: now.year(),
	})
	const [gameParam, setGameParam] = useState("")
	const isAuth = state.user ? true : false

	let paramString = dateParamString(dateParams) + "&order=desc"
	if (gameParam)
		paramString = `game=${encodeURIComponent(gameParam)}&order=desc`

	useEffect(() => {
		actions.setupSessionList(paramString)
	}, [paramString, actions])

	const handleGameChange = (event) => {
		setGameParam(event.value)
	}

	const sessionsToShow = state.sessionList.map((entry) => {
		return <Session key={entry.id} session={entry} isAuth={isAuth} />
	})

	const totals = sumTotalSessions(state.sessionList)

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
				<tbody>
					{sessionsToShow}
					{totals}
				</tbody>
			</Table>
			{gameParam && <SessionChart />}
		</>
	)
}

export default SessionList
