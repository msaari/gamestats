import React, { useState, useEffect } from "react"
import Select from "react-select"
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import gameService from "../../../services/games"

const GameSelector = ({ changeHandler }) => {
	const [gameNames, setGameNames] = useState([])
	const [showSelect, setShowSelect] = useState(false)

	useEffect(() => {
		if (showSelect) {
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
		}
	}, [showSelect])

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
					<Select onChange={changeHandler} id="game" options={gameNames} />
				) : null}
			</Col>
		</Row>
	)
}

export default GameSelector
