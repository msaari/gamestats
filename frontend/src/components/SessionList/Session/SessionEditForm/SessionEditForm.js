import React from "react"
import AWN from "awesome-notifications"
import SessionForm from "../SessionForm/SessionForm"
import { useOvermind } from "../../../../overmind"

const SessionEditForm = ({ session, modalCloser }) => {
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

			const newSession = {
				date: date.getTime(),
				game: event.target.game.value,
				plays: event.target.plays.value,
				wins: event.target.wins.value,
				players: event.target.players.value
			}
			actions.updateSession({ id: session.id, object: newSession })
			const notifier = new AWN()
			notifier.success("Session updated!")
			modalCloser()
		} catch (exception) {
			const notifier = new AWN()
			notifier.alert(`There was a problem saving the session: ${exception}`)
		}
	}

	const date = new Date(session.date)

	return (
		<SessionForm
			formHandler={formHandler}
			date={date}
			gameDefaultValue={[{ label: session.game, value: session.game }]}
			plays={session.plays}
			wins={session.wins}
			players={session.players}
		/>
	)
}

export default SessionEditForm
