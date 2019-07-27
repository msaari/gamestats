import React, { useState, useEffect } from "react"
import AWN from "awesome-notifications"
import SessionForm from "./SessionForm"

import sessionService from "../services/sessions"
import gameService from "../services/games"

const NewSessionForm = ({ userprofile }) => {
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

	const zeroPad = (input, length) => {
		return (Array(length + 1).join("0") + input).slice(-length)
	}

	const formHandler = async event => {
		event.persist()
		event.preventDefault()
		try {
			const dateYY = event.target["dateYY"].value
			const dateMM = zeroPad(event.target["dateMM"].value, 2)
			const dateDD = zeroPad(event.target["dateDD"].value, 2)

			const dateString = `${dateYY}-${dateMM}-${dateDD}T15:00:00`
			const date = new Date(dateString)
			const newSession = {
				date: date.getTime(),
				game: event.target.game.value,
				plays: event.target.plays.value,
				wins: event.target.wins.value,
				players: event.target.players.value,
				ungeeked: true
			}
			await sessionService.create(newSession)
			const notifier = new AWN()
			notifier.success("Session saved!")
			event.target.game.value = ""
			event.target.plays.value = "1"
			event.target.wins.value = "0"
			event.target.players.value = "2"
		} catch (exception) {
			const notifier = new AWN()
			console.log(exception)
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
