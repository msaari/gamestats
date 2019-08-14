import React, { useEffect } from "react"
import CreatableSelect from "react-select/lib/Creatable"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import SessionDate from "./SessionDate/SessionDate"
import { useOvermind } from "../../../../overmind"

const SessionForm = props => {
	const { state, actions } = useOvermind()

	useEffect(() => {
		if (state.gameNames.length === 0) {
			actions.getGameNames()
		}
	}, [state.gameNames, actions])

	return (
		<form onSubmit={props.formHandler}>
			<Form.Row>
				<Form.Group as={Col} sm={5} controlId="sessionDate">
					<Form.Row>
						<SessionDate date={props.date} />
					</Form.Row>
				</Form.Group>
				<Form.Group as={Col} sm={7} controlId="sessionGame">
					<Form.Label>Game</Form.Label>
					<CreatableSelect
						name="game"
						defaultValue={props.gameDefaultValue}
						options={state.gameNames}
					/>
				</Form.Group>
			</Form.Row>
			<Form.Row>
				<Form.Group as={Col} controlId="sessionGames">
					<Form.Label>Plays</Form.Label>
					<Form.Control
						type="number"
						name="plays"
						defaultValue={props.plays}
						placeholder="1"
					/>
				</Form.Group>
				<Form.Group as={Col} controlId="sessionWins">
					<Form.Label>Wins</Form.Label>{" "}
					<Form.Control
						type="number"
						name="wins"
						defaultValue={props.wins}
						placeholder="0"
					/>
				</Form.Group>
				<Form.Group as={Col} controlId="sessionPlayers">
					<Form.Label>Players</Form.Label>{" "}
					<Form.Control
						type="number"
						name="players"
						defaultValue={props.players}
						placeholder="2"
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
