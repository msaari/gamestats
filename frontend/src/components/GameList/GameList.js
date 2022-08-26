import React, { useState, useEffect } from "react"
//import moment from "moment"
import dayjs from "dayjs"
import Game from "./Game/Game"
import GameFilter from "./GameFilter/GameFilter"
import Rating from "./Game/Rating/Rating"
import DateRange from "../DateRange"
import ExportList from "../ExportList"
import Table from "react-bootstrap/Table"
import Spinner from "react-bootstrap/Spinner"
import { useActions, useAppState } from "../../overmind"

const dateParamString = dateParams => {
	let paramArray = []
	if (Object.entries(dateParams).length !== 0) {
		paramArray.push(
			`from=${dateParams.fromYear}-${dateParams.fromMonth}-${dateParams.fromDay}`
		)
		paramArray.push(
			`to=${dateParams.toYear}-${dateParams.toMonth}-${dateParams.toDay}`
		)
	}
	return paramArray.join("&")
}

const sumTotalGames = games => {
	const totals = {
		plays: 0,
		wins: 0,
		rating: 0,
		playTime: 0
	}

	games.forEach(game => {
		if (game.parent) return
		totals.plays += parseInt(game.plays)
		totals.wins += parseInt(game.wins)
		totals.rating += parseInt(game.rating) * parseInt(game.plays)
		totals.playTime += parseInt(game.plays) * parseInt(game.gameLength)
	})
	totals.averageRating =
		games.length > 0 ? Math.round((totals.rating / totals.plays) * 10) / 10 : 0
	totals.playTime = Math.round(totals.playTime / 60)

	return (
		<tr>
			<td>&nbsp;</td>
			<td>Total playtime {totals.playTime} hours</td>
			<td>{totals.plays}</td>
			<td>{totals.wins}</td>
			<td>
				<Rating value={totals.averageRating} />
			</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		</tr>
	)
}
const GameList = ({ path }) => {
	const actions = useActions()
	const state = useAppState()

	const [gameFilter, setGameFilter] = useState("")
	const [incompleteFilter, setIncompleteFilter] = useState(false)
	const [expansionFilter, setExpansionFilter] = useState(false)
	const [sorting, setSorting] = useState("names")

	const now = dayjs()

	const [dateParams, setDateParams] = useState({
		fromDay: '01',
		fromMonth: '01',
		fromYear: now.year(),
		toDay: now.date(),
		toMonth: now.format('MM'),
		toYear: now.year()
	})

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

	switch (sorting) {
		case "year":
			filteredGameList.sort((a, b) => b.year - a.year)
			break
		case "plays":
			filteredGameList.sort((a, b) => b.plays - a.plays)
			break
		case "wins":
			filteredGameList.sort((a, b) => b.wins - a.wins)
			break
		case "rating":
			filteredGameList.sort((a, b) => b.rating - a.rating)
			break
		case "happiness":
			filteredGameList.sort((a, b) => b.happiness - a.happiness)
			break
		case "hotness":
			filteredGameList.sort((a, b) => b.hotness - a.hotness)
			break
		case "stayingpower":
			filteredGameList.sort((a, b) => b.stayingPower - a.stayingPower)
			break
		case "monthmetric":
			filteredGameList.sort((a, b) => b.monthMetric - a.monthMetric)
			break
		case "yearmetric":
			filteredGameList.sort((a, b) => {
				const aYears = new Date().getFullYear() - a.firstYear + 1
				const bYears = new Date().getFullYear() - b.firstYear + 1

				const aScore = a.yearMetric * 2 - aYears + a.yearMetric
				const bScore = b.yearMetric * 2 - bYears + b.yearMetric

				return bScore - aScore
			})
			break
		case "names":
			filteredGameList.sort((a, b) => {
				if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
				return 1
			})
			break
		default:
	}

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

	const totals = sumTotalGames(filteredGameList)

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
							<th onClick={() => sortBy("monthmetric")}>
								<abbr title="Month Metric">MM</abbr>
							</th>
							<th onClick={() => sortBy("yearmetric")}>
								<abbr title="Year Metric">YM</abbr>
							</th>
							<th onClick={() => sortBy("happiness")}>
								<abbr title="Huber Happiness Metric">HHM</abbr>
							</th>
							<th onClick={() => sortBy("hotness")}>Hotness</th>
							<th onClick={() => sortBy("stayingpower")}>
								<abbr title="Eric Brosius Staying Power">SP</abbr>
							</th>
							<th onClick={() => sortBy("year")}>Year</th>
						</tr>
					</thead>
					<tbody>
						{gamesToShow}
						{totals}
					</tbody>
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
