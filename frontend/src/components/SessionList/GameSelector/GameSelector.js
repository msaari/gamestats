import React, { useState, useEffect } from "react"
import Select from "react-select"
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { useOvermind } from "../../../overmind"

const GameSelector = ({ changeHandler }) => {
	const { state, actions } = useOvermind()

	const [showSelect, setShowSelect] = useState(false)

	useEffect(() => {
		if (showSelect && state.gameNames.length === 0) {
			actions.getGameNames()
		}
	}, [showSelect, actions, state.gameNames])

	const toggleSelect = () => {
		setShowSelect(!showSelect)
	}

	return (
		<Row>
			<Col sm="2">
				<Button variant="primary" onClick={toggleSelect}>
					Choose game
				</Button>
			</Col>
			<Col>
				{showSelect ? (
					<Select
						onChange={changeHandler}
						id="game"
						options={state.gameNames}
					/>
				) : null}
			</Col>
		</Row>
	)
}

export default GameSelector
