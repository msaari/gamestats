import React from "react"
import AWN from "awesome-notifications"
import { useActions } from "../../../../overmind"

import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import { LinkExternalIcon } from "@primer/octicons-react"

let closeModal = null
let action = null

const handleFormChange = async (event) => {
	event.persist()
	event.preventDefault()
	try {
		const newGame = {
			designers: event.target.designers.value
				.split(",")
				.map((item) => item.trim()),
			publisher: event.target.publisher.value
				.split(",")
				.map((item) => item.trim()),
			year: event.target.year.value,
			name: event.target.name.value,
			bgg: event.target.bgg.value,
			rating: event.target.rating.value,
			gameLength: event.target.gameLength.value,
			parent: event.target.parent.value,
		}

		action.updateGame({ id: event.target.id.value, object: newGame })
		const notifier = new AWN()
		notifier.success("Game updated!")
		closeModal()
	} catch (exception) {
		const notifier = new AWN()
		notifier.alert(`There was a problem saving the game: ${exception}`)
	}
}

const deleteGame = async (id) => {
	const notifier = new AWN()
	const onOk = () => {
		action.deleteGame(id)
		closeModal()
	}
	const onCancel = () => {
		notifier.info("User says no.")
	}
	notifier.confirm("Are you sure you want to remove this game?", onOk, onCancel)
}

const GameEditForm = ({ game, modalCloser }) => {
	const actions = useActions()
	action = actions
	closeModal = modalCloser

	return (
		<form className="gameEditForm" onSubmit={handleFormChange}>
			<input type="hidden" name="id" value={game.id} />
			<Form.Group as={Form.Row} controlId="gameName">
				<Form.Label column sm={2}>
					Name
				</Form.Label>
				<Col sm={10}>
					<Form.Control type="text" name="name" defaultValue={game.name} />
				</Col>
			</Form.Group>
			<Form.Group as={Form.Row} controlId="gameDesigners">
				<Form.Label column sm={2}>
					Designers
				</Form.Label>
				<Col sm={10}>
					<Form.Control
						type="text"
						name="designers"
						defaultValue={game.designers}
					/>
				</Col>
			</Form.Group>
			<Form.Group as={Form.Row} controlId="gamePublishers">
				<Form.Label column sm={2}>
					Publisher
				</Form.Label>
				<Col sm={10}>
					<Form.Control
						type="text"
						name="publisher"
						defaultValue={game.publisher}
					/>
				</Col>
			</Form.Group>
			<Form.Group as={Form.Row} controlId="gameYear">
				<Form.Label column sm={2}>
					Year
				</Form.Label>
				<Col sm={10}>
					<Form.Control type="text" name="year" defaultValue={game.year} />
				</Col>
			</Form.Group>
			<Form.Group as={Form.Row} controlId="gameBGG">
				<Form.Label column sm={2}>
					BGG ID:
					<a
						tabIndex="-1"
						href={"https://www.boardgamegeek.com/boardgame/" + game.bgg + "/"}
					>
						<LinkExternalIcon />
					</a>
				</Form.Label>
				<Col sm={10}>
					<Form.Control type="text" name="bgg" defaultValue={game.bgg} />
				</Col>
			</Form.Group>
			<Form.Group as={Form.Row} controlId="gameRating">
				<Form.Label column sm={2}>
					Rating:
				</Form.Label>
				<Col sm={10}>
					<Form.Control type="text" name="rating" defaultValue={game.rating} />
				</Col>
			</Form.Group>
			<Form.Group as={Form.Row} controlId="gameLength">
				<Form.Label column sm={2}>
					Length:
				</Form.Label>
				<Col sm={10}>
					<Form.Control
						type="text"
						name="gameLength"
						defaultValue={game.gameLength}
					/>
				</Col>
			</Form.Group>
			<Form.Group as={Form.Row} controlId="gameParent">
				<Form.Label column sm={2}>
					Parent game:
				</Form.Label>
				<Col sm={10}>
					<Form.Control type="text" name="parent" defaultValue={game.parent} />
				</Col>
			</Form.Group>
			<Button variant="primary" type="submit">
				Save
			</Button>
			<Button
				className="float-right"
				variant="danger"
				onClick={() => deleteGame(game.id)}
			>
				Delete
			</Button>
		</form>
	)
}

export default GameEditForm
