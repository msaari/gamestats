import React, { useState, useEffect } from "react"
import AWN from "awesome-notifications"
import SessionForm from "./SessionForm"

import sessionService from "../services/sessions"
import gameService from "../services/games"

const SessionEditForm = props => {
	const [gameNames, setGameNames] = useState([])
	const [submitted, setSubmitted] = useState(false)

	const session = props.session

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
				players: event.target.players.value
			}
			await sessionService.update(session.id, newSession)
			const notifier = new AWN()
			notifier.success("Session updated!")
			setSubmitted(true)
		} catch (exception) {
			const notifier = new AWN()
			notifier.alert(`There was a problem saving the session: ${exception}`)
		}
	}

	const date = new Date(session.date)

	return (
		<>
			{!submitted ? (
				<SessionForm
					formHandler={formHandler}
					date={date}
					gameNames={gameNames}
					gameDefaultValue={[{ label: session.game, value: session.game }]}
					plays={session.plays}
					wins={session.wins}
					players={session.players}
				/>
			) : null}
		</>
	)
}

export default SessionEditForm
