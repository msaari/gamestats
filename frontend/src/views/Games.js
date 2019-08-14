import React from "react"
import GameList from "../components/GameList/GameList"
import Container from "react-bootstrap/Container"

const Games = ({ match }) => {
	const path = match.path.replace(/\/games\/?/, "")
	return (
		<Container>
			<h2>List of games</h2>
			<GameList path={path} />
		</Container>
	)
}

export default Games
