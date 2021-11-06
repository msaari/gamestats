import React, { useState, useEffect } from "react"
import Table from "react-bootstrap/Table"
import { useOvermind } from "../../overmind"

const PeriodList = ({ name }) => {
	const { state, actions } = useOvermind()

	const [sorting, setSorting] = useState("name")

	useEffect(() => {
		if (name === "Year") {
			actions.getYearList()
		} else {
			actions.getMonthList()
		}
	}, [actions, name])

	let counter = 0
	let periodList =
		name === "Year"
			? state.yearList.filter((a) => true)
			: state.monthList.filter((a) => true)
	switch (sorting) {
		case "name": {
			periodList.sort((a, b) => {
				if (a.name < b.name) {
					return -1
				}
				if (a.name > b.name) {
					return 1
				}
				return 0
			})
			break
		}
		case "plays":
			periodList.sort((a, b) => b.plays - a.plays)
			break
		case "games":
			periodList.sort((a, b) => b.totalGames - a.totalGames)
			break
		case "avgplayers":
			periodList.sort((a, b) => b.avgPlayers - a.avgPlayers)
			break
		case "hours":
			periodList.sort((a, b) => b.totalLength - a.totalLength)
			break
		case "length":
			periodList.sort((a, b) => {
				const avgLengthA = Number.parseFloat(
					Number.parseFloat(a.totalLength) / Number.parseFloat(a.plays)
				)
				const avgLengthB = Number.parseFloat(
					Number.parseFloat(b.totalLength) / Number.parseFloat(b.plays)
				)
				return avgLengthB - avgLengthA
			})
			break
		default:
	}

	const sortBy = (sort) => {
		setSorting(sort)
	}

	const tableList = periodList.map((row) => {
		counter += 1
		const avgPlayers = Number.parseFloat(row.avgPlayers).toPrecision(3)
		const avgLength = Number.parseFloat(
			Number.parseFloat(row.totalLength) / Number.parseFloat(row.plays)
		).toPrecision(3)
		const hours = Number.parseFloat(row.totalLength / 60).toPrecision(3)
		return (
			<tr key={counter}>
				<td>{row.name}</td>
				<td>{row.plays}</td>
				<td>{row.totalGames}</td>
				<td>{avgPlayers}</td>
				<td>{hours}</td>
				<td>{avgLength}</td>
			</tr>
		)
	})

	return (
		<>
			<Table className="mt-4">
				<thead>
					<tr>
						<th onClick={() => sortBy("name")}>{name}</th>
						<th onClick={() => sortBy("plays")}>Plays</th>
						<th onClick={() => sortBy("games")}>Games</th>
						<th onClick={() => sortBy("avgplayers")}>Avg. Players</th>
						<th onClick={() => sortBy("hours")}>Total hours</th>
						<th onClick={() => sortBy("length")}>Avg. length</th>
					</tr>
				</thead>
				<tbody>{tableList}</tbody>
			</Table>
		</>
	)
}

export default PeriodList
