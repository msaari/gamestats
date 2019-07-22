import React, { useState, useEffect } from "react"
import AWN from "awesome-notifications"
import SessionForm from "./SessionForm"

import sessionService from "../services/sessions"
import gameService from "../services/games"

const NewSessionForm = props => {
	const [gameNames, setGameNames] = useState([])

	useEffect(() => {
		let isSubscribed = true
		gameService.getAll().then(games => {
			if (isSubscribed) {
				setGameNames(
					games.map(game => {
						return {
							label: game.name,
							value: game.name
						}
					})
				)
			}
		})
		return () => (isSubscribed = false)
	}, [])

	const formHandler = async event => {
		event.persist()
		event.preventDefault()
		try {
			const date = new Date(
				`${event.target["year-input"].value}-${
					event.target["month-input"].value
				}-${event.target["day-input"].value} 15:00`
			)
			const newSession = {
				date: date.getTime(),
				game: event.target.game.value,
				plays: event.target.plays.value,
				wins: event.target.wins.value,
				players: event.target.players.value
			}
			console.log(newSession)
			await sessionService.create(newSession)
			const notifier = new AWN()
			notifier.success("Session saved!")
			event.target.game.value = ""
			event.target.plays.value = "1"
			event.target.wins.value = "0"
			event.target.players.value = "2"
		} catch (exception) {
			const notifier = new AWN()
			notifier.alert(`There was a problem saving the session: ${exception}`)
		}
	}

	const today = new Date()

	return (
		<SessionForm
			formHandler={formHandler}
			date={today}
			gameNames={gameNames}
			plays="1"
			wins="0"
			players="2"
		/>
	)
}

export default NewSessionForm
