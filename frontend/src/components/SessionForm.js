import React from "react"
import TextDatePicker from "react-text-datepicker"
import CreatableSelect from "react-select/lib/Creatable"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"

const SessionForm = props => {
	return (
		<form onSubmit={props.formHandler}>
			<Form.Row>
				<Form.Group as={Col} sm={2} controlId="sessionDate">
					<Form.Label>Date</Form.Label>
					<Form.Row>
						<TextDatePicker name="date" value={props.date} />
					</Form.Row>
				</Form.Group>
				<Form.Group as={Col} sm={10} controlId="sessionGame">
					<Form.Label>Game</Form.Label>
					<CreatableSelect
						name="game"
						defaultValue={props.gameDefaultValue}
						options={props.gameNames}
					/>
				</Form.Group>
			</Form.Row>
			<Form.Row>
				<Form.Group as={Col} controlId="sessionGames">
					<Form.Label>Plays</Form.Label>
					<Form.Control type="number" name="plays" defaultValue={props.plays} />
				</Form.Group>
				<Form.Group as={Col} controlId="sessionWins">
					<Form.Label>Wins</Form.Label>{" "}
					<Form.Control type="number" name="wins" defaultValue={props.wins} />
				</Form.Group>
				<Form.Group as={Col} controlId="sessionPlayers">
					<Form.Label>Players</Form.Label>{" "}
					<Form.Control
						type="number"
						name="players"
						defaultValue={props.players}
					/>
				</Form.Group>
			</Form.Row>
			<Button variant="primary" type="Submit">
				Save
			</Button>
		</form>
	)
}

export default SessionForm
