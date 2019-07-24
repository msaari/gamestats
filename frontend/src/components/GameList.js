import React, { useState, useEffect } from "react"
import Game from "./Game.js"
import GameFilter from "./GameFilter.js"
import gameService from "../services/games"

const GameList = ({ path, user }) => {
	const [gameList, setGameList] = useState([])
	const [gameFilter, setGameFilter] = useState("")
	const [incompleteFilter, setIncompleteFilter] = useState(false)
	const [expansionFilter, setExpansionFilter] = useState(false)
	const [sorting, setSorting] = useState("names")

	const isAuth = user ? true : false

	useEffect(() => {
		gameService.getPath(path).then(games => {
			setGameList(games)
		})
	}, [path])

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
			<table>
				<thead>
					<tr>
						<th>#</th>
						<th onClick={() => sortBy("names")}>Game</th>
						<th onClick={() => sortBy("plays")}>Plays</th>
						<th onClick={() => sortBy("wins")}>Wins</th>
						<th onClick={() => sortBy("rating")}>Rating</th>
					</tr>
				</thead>
				<tbody>{gamesToShow}</tbody>
			</table>
		</>
	)
}

export default GameList
