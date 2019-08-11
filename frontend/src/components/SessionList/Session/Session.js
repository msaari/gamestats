import React, { useState } from "react"
import AWN from "awesome-notifications"
import sessionService from "../../../services/sessions"
import SessionEditForm from "./SessionEditForm/SessionEditForm"
import SessionGeekLink from "./SessionGeekLink/SessionGeekLink"

const Session = ({ session, isAuth }) => {
	const [editForm, setEditForm] = useState(false)

	const deleteSession = async () => {
		const notifier = new AWN()
		const onOk = () => {
			sessionService.deleteSession(session.id)
		}
		const onCancel = () => {
			notifier.info("User says no.")
		}
		notifier.confirm(
			"Are you sure you want to remove this session?",
			onOk,
			onCancel
		)
	}

	const date = session.date.substring(0, 10)

	return (
		<li>
			{date}: {session.game}{" "}
			{session.ungeeked && <SessionGeekLink session={session} />} (
			{session.wins}/{session.plays}, {session.players}){" "}
			{isAuth && <button onClick={() => setEditForm(true)}>Edit</button>}
			{isAuth && <button onClick={deleteSession}>Delete</button>}
			{editForm && <SessionEditForm session={session} />}
		</li>
	)
}

export default Session