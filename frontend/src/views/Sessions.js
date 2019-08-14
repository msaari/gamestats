import React from "react"
import SessionList from "../components/SessionList/SessionList"
import Container from "react-bootstrap/Container"

const Sessions = () => {
	return (
		<Container>
			<h2>List of sessions</h2>
			<SessionList />
		</Container>
	)
}

export default Sessions
