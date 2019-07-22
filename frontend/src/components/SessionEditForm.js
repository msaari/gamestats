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
