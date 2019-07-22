import React, { useState, useEffect } from "react"
import Game from "./Game.js"
import GameFilter from "./GameFilter.js"
import gameService from "../services/games"

const GameList = props => {
	const [gameList, setGameList] = useState([])
	const [gameFilter, setGameFilter] = useState("")
	const [incompleteFilter, setIncompleteFilter] = useState(false)
	const [expansionFilter, setExpansionFilter] = useState(false)
	const [sorting, setSorting] = useState("names")

	useEffect(() => {
		gameService.getAll().then(games => {
			setGameList(games)
		})
	}, [])

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

	const handleFilterChange = event => {
		setGameFilter(event.target.value)
	}

	const handleIncompleteFilterChange = event => {
		setIncompleteFilter(event.target.checked)
	}

	const handleExpansionFilterChange = event => {
		setExpansionFilter(event.target.checked)
	}

	const sortByPlays = () => {
		setSorting("plays")
	}

	const sortByWins = () => {
		setSorting("wins")
	}

	const sortByNames = () => {
		setSorting("names")
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
			<table>
				<thead>
					<tr>
						<th>#</th>
						<th onClick={sortByNames}>Game</th>
						<th onClick={sortByPlays}>Plays</th>
						<th onClick={sortByWins}>Wins</th>
					</tr>
				</thead>
				<tbody>{gamesToShow}</tbody>
			</table>
		</>
	)
}

export default GameList
