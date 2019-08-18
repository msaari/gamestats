import React from "react"
import FirstPlayList from "../components/FirstPlayList/FirstPlayList"
import Container from "react-bootstrap/Container"

const FirstPlays = () => {
	return (
		<Container>
			<h2>First plays of games</h2>
			<FirstPlayList />
		</Container>
	)
}

export default FirstPlays
