import React, { useEffect } from "react"
import Table from "react-bootstrap/Table"
import Spinner from "react-bootstrap/Spinner"
import { useOvermind } from "../../overmind"
import moment from "moment"

const FirstPlayList = () => {
	const { state, actions } = useOvermind()

	useEffect(() => {
		actions.getFiftyPlays()
	}, [actions])

	let counter = 0
	const fiftyList = state.fiftyPlays.filter(row => row.goalPlayDate)
	const gameList = fiftyList.map(row => {
		const date = moment(row.goalPlayDate)
		let time = row.differenceInDays
		let unit = "days"
		if (time > 360 && time < 365 * 2) {
			time = Number.parseFloat(time / 30).toPrecision(3)
			unit = "months"
		}
		if (time >= 365 * 2) {
			time = Number.parseFloat(time / 365).toPrecision(2)
			unit = "years"
		}
		counter += 1
		return (
			<tr key={counter}>
				<td>{counter}</td>
				<td>{row.game}</td>
				<td>{date.format("D.M.YYYY")}</td>
				<td>
					in {time} {unit}
				</td>
			</tr>
		)
	})

	const bubblingUnder = state.fiftyPlays
		.filter(row => !row.goalPlayDate)
		.sort((a, b) => b.plays - a.plays)
	const bubbleList = bubblingUnder.map(row => {
		counter += 1
		return (
			<tr key={counter}>
				<td>{row.game}</td>
				<td>{row.plays}</td>
			</tr>
		)
	})

	return (
		<>
			{state.isFetchingFiftyPlays && (
				<Spinner animation="border" role="status">
					<span className="sr-only">Loading...</span>
				</Spinner>
			)}
			{!state.isFetchingFiftyPlays && (
				<>
					<Table striped>
						<thead>
							<tr>
								<th>#</th>
								<th>Game</th>
								<th>Date</th>
								<th>Time</th>
							</tr>
						</thead>
						<tbody>{gameList}</tbody>
					</Table>
					<h3>Bubbling Under</h3>
					<Table striped>
						<thead>
							<tr>
								<th>Game</th>
								<th>Plays</th>
							</tr>
						</thead>
						<tbody>{bubbleList}</tbody>
					</Table>
				</>
			)}
		</>
	)
}

export default FirstPlayList
