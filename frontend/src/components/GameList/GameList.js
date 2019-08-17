import React, { useState, useEffect } from "react"
import Game from "./Game/Game"
import GameFilter from "./GameFilter/GameFilter"
import DateRange from "../DateRange"
import ExportList from "../ExportList"
import Table from "react-bootstrap/Table"
import Spinner from "react-bootstrap/Spinner"
import { useOvermind } from "../../overmind"

const dateParamString = dateParams => {
	let paramArray = []
	if (Object.entries(dateParams).length !== 0) {
		paramArray.push(
			`from=${dateParams.fromYear}-${dateParams.fromMonth}-${
				dateParams.fromDay
			}`
		)
		paramArray.push(
			`to=${dateParams.toYear}-${dateParams.toMonth}-${dateParams.toDay}`
		)
	}
	return paramArray.join("&")
}

const GameList = ({ path }) => {
	const { state, actions } = useOvermind()

	const [gameFilter, setGameFilter] = useState("")
	const [incompleteFilter, setIncompleteFilter] = useState(false)
	const [expansionFilter, setExpansionFilter] = useState(false)
	const [sorting, setSorting] = useState("names")
	const [dateParams, setDateParams] = useState({})

	let paramString = ""
	if (path === "top100") {
		const params = []
		const year = new Date().getFullYear() - 2
		params.push("rating=7")
		params.push(`from=${year}-01-01`)
		params.push("noexpansions=1")
		params.push("plays=1")
		paramString = params.join("&")
	} else {
		paramString = dateParamString(dateParams)
	}

	useEffect(() => {
		actions.setupGameList(paramString)
	}, [paramString, actions])

	let filteredGameList = state.gameList.filter(game => game.plays > 0)

	if (gameFilter) {
		filteredGameList = filteredGameList.filter(game =>
			game.name.toLowerCase().includes(gameFilter.toLowerCase())
		)
	}
	if (incompleteFilter) {
		filteredGameList = filteredGameList.filter(
			game => game.designers.length === 0
		)
	}
	if (expansionFilter) {
		filteredGameList = filteredGameList.filter(
			game => game.parent === undefined || game.parent.length === 0
		)
	}

	if (sorting === "plays") filteredGameList.sort((a, b) => b.plays - a.plays)
	if (sorting === "wins") filteredGameList.sort((a, b) => b.wins - a.wins)
	if (sorting === "rating") filteredGameList.sort((a, b) => b.rating - a.rating)
	if (sorting === "happiness")
		filteredGameList.sort((a, b) => b.happiness - a.happiness)
	if (sorting === "hotness")
		filteredGameList.sort((a, b) => b.hotness - a.hotness)
	if (sorting === "names")
		filteredGameList.sort((a, b) => {
			if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
			return 1
		})

	let counter = 0
	const gamesToShow = filteredGameList.map(game => {
		counter += 1
		return <Game counter={counter} key={game.id} game={game} />
	})

	const plainText = filteredGameList.map(game => game.name)

	const handleFilterChange = event => {
		setGameFilter(event.target.value)
	}

	const handleIncompleteFilterChange = event => {
		setIncompleteFilter(event.target.checked)
	}

	const handleExpansionFilterChange = event => {
		setExpansionFilter(event.target.checked)
	}

	const sortBy = sort => {
		setSorting(sort)
	}

	return (
		<>
			<GameFilter
				filterText={gameFilter}
				textChangeEvent={handleFilterChange}
				incompleteFilter={incompleteFilter}
				incompleteChangeEvent={handleIncompleteFilterChange}
				expansionsFilter={expansionFilter}
				expansionsChangeEvent={handleExpansionFilterChange}
			/>
			<DateRange paramSetter={setDateParams} />
			{state.isFetchingGames && (
				<Spinner animation="border" role="status">
					<span className="sr-only">Loading...</span>
				</Spinner>
			)}
			{!state.isFetchingGames && gamesToShow.length > 0 && (
				<Table striped responsive>
					<thead>
						<tr>
							<th>#</th>
							<th onClick={() => sortBy("names")}>Game</th>
							<th onClick={() => sortBy("plays")}>Plays</th>
							<th onClick={() => sortBy("wins")}>Wins</th>
							<th onClick={() => sortBy("rating")}>Rating</th>
							<th onClick={() => sortBy("happiness")}>
								<abbr title="Huber Happiness Metric">HHM</abbr>
							</th>
							<th onClick={() => sortBy("hotness")}>Hotness</th>
						</tr>
					</thead>
					<tbody>{gamesToShow}</tbody>
				</Table>
			)}
			{!state.isFetchingGames && gamesToShow.length < 1 && (
				<p>Nothing found!</p>
			)}
			{path === "top100" ? <ExportList text={plainText} /> : null}
		</>
	)
}

export default GameList
