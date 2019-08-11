import React, { useState, useEffect } from "react"
import Game from "./Game/Game"
import GameFilter from "./GameFilter/GameFilter"
import DateRange from "../DateRange"
import gameService from "../../services/games"
import ExportList from "../ExportList"
import Table from "react-bootstrap/Table"

const dateParamString = dateParams => {
	let paramArray = []
	if (Object.entries(dateParams).length !== 0) {
		console.log(dateParams)
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

const GameList = ({ path, user }) => {
	const [gameList, setGameList] = useState([])
	const [gameFilter, setGameFilter] = useState("")
	const [incompleteFilter, setIncompleteFilter] = useState(false)
	const [expansionFilter, setExpansionFilter] = useState(false)
	const [sorting, setSorting] = useState("names")
	const [dateParams, setDateParams] = useState({})

	const isAuth = user ? true : false

	useEffect(() => {
		const params = []
		let paramString = ""
		if (path === "top100") {
			const year = new Date().getFullYear() - 2
			params.push("rating=7")
			params.push(`from=${year}-01-01`)
			params.push("noexpansions=1")
			params.push("played=1")
			paramString = params.join("&")
		} else {
			paramString = dateParamString(dateParams)
		}
		gameService.getPath("", paramString).then(games => {
			setGameList(games)
		})
	}, [path, dateParams])

	let filteredGameList = gameList
	if (gameFilter) {
		filteredGameList = gameList.filter(game =>
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
		filteredGameList.slice().sort((a, b) => {
			if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
			return 1
		})

	let counter = 0
	const gamesToShow = filteredGameList.map(game => {
		counter += 1
		return <Game counter={counter} key={game.id} game={game} isAuth={isAuth} />
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
			{path === "top100" ? <ExportList text={plainText} /> : null}
		</>
	)
}

export default GameList
