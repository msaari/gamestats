import React, { useState } from "react"
import gameService from "../services/games"
import AWN from "awesome-notifications"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"

const Game = ({ game, counter }) => {
	const [moreVisible, setMoreVisible] = useState(null)

	const toggleMoreVisibility = () => {
		setMoreVisible(!moreVisible)
	}

	const moreVisibilityStyle = {
		display: moreVisible ? "" : "none",
		paddingTop: 10
	}

	const handleFormChange = async event => {
		event.persist()
		event.preventDefault()
		try {
			const newGame = {
				designers: event.target.designers.value.split(","),
				publisher: event.target.publisher.value.split(","),
				year: event.target.year.value,
				name: event.target.name.value,
				bgg: event.target.bgg.value,
				rating: event.target.rating.value,
				length: event.target.gameLength.value,
				parent: event.target.parent.value
			}
			await gameService.update(event.target.id.value, newGame)
			const notifier = new AWN()
			notifier.success("Game updated!")
			toggleMoreVisibility()
		} catch (exception) {
			const notifier = new AWN()
			notifier.alert(`There was a problem saving the game: ${exception}`)
		}
	}

	return (
		<tr>
			<td className="counter">{counter}</td>
			<td>
				<span onClick={toggleMoreVisibility}>{game.name}</span>
				<div style={moreVisibilityStyle}>
					<form className="gameEditForm" onSubmit={handleFormChange}>
						<input type="hidden" name="id" value={game.id} />
						<Form.Group as={Form.Row} controlId="gameName">
							<Form.Label column sm={2}>
								Name
							</Form.Label>
							<Col sm={10}>
								<Form.Control
									type="text"
									name="name"
									defaultValue={game.name}
								/>
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
								<Form.Control
									type="text"
									name="year"
									defaultValue={game.year}
								/>
							</Col>
						</Form.Group>
						<Form.Group as={Form.Row} controlId="gameBGG">
							<Form.Label column sm={2}>
								BGG ID:
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
								<Form.Control
									type="text"
									name="rating"
									defaultValue={game.rating}
								/>
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
								<Form.Control
									type="text"
									name="parent"
									defaultValue={game.parent}
								/>
							</Col>
						</Form.Group>
						<Button variant="primary" type="submit">
							Save
						</Button>
					</form>
				</div>
			</td>
			<td>{game.plays}</td>
			<td>{game.wins}</td>
		</tr>
	)
}

export default Game
