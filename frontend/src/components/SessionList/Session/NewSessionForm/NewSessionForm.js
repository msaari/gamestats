import React from "react"
import AWN from "awesome-notifications"
import SessionForm from "../SessionForm/SessionForm"
import { useOvermind } from "../../../../overmind"

const NewSessionForm = () => {
	const { actions } = useOvermind()

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

			const plays = event.target.plays.value
				? event.target.plays.value
				: event.target.plays.placeholder
			const wins = event.target.wins.value
				? event.target.wins.value
				: event.target.wins.placeholder
			const players = event.target.players.value
				? event.target.players.value
				: event.target.players.placeholder

			const newSession = {
				date: date.getTime(),
				game: event.target.game.value,
				plays,
				wins,
				players,
				ungeeked: true
			}
			actions.createSession(newSession)
			actions.syncTotalPlays()
			const notifier = new AWN()
			notifier.success("Session saved!")
		} catch (exception) {
			const notifier = new AWN()
			console.log(exception)
			notifier.alert(`There was a problem saving the session: ${exception}`)
		}
	}

	const today = new Date()

	return <SessionForm formHandler={formHandler} date={today} />
}

export default NewSessionForm
