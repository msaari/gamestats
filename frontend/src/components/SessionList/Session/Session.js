import React, { useState } from "react"
import AWN from "awesome-notifications"
import sessionService from "../../../services/sessions"
import SessionEditForm from "./SessionEditForm/SessionEditForm"
import SessionGeekLink from "./SessionGeekLink/SessionGeekLink"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Octicon, { X } from "@primer/octicons-react"

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

	const closeModal = () => {
		setEditForm(false)
	}

	const openModal = () => {
		setEditForm(true)
	}

	const date = session.date.substring(0, 10)

	return (
		<tr>
			<td>{date}</td>
			<td>
				{session.game}{" "}
				{isAuth && session.ungeeked && <SessionGeekLink session={session} />}
			</td>
			<td>{session.plays}</td>
			<td>{session.wins}</td>
			<td>{session.players}</td>
			{isAuth && (
				<td>
					<Button variant="outline-primary" size="sm" onClick={openModal}>
						Edit
					</Button>{" "}
					<Button variant="danger" size="sm" onClick={deleteSession}>
						Delete
					</Button>
					<Modal size="lg" show={editForm} onHide={closeModal}>
						<Modal.Header>
							<h2>Edit session</h2>
							<Button
								onClick={closeModal}
								variant="outline-dark"
								className="float-right"
							>
								<Octicon icon={X} />
							</Button>
						</Modal.Header>
						<Modal.Body>
							<SessionEditForm modalCloser={closeModal} session={session} />
						</Modal.Body>
					</Modal>
				</td>
			)}
		</tr>
	)
}

export default Session
