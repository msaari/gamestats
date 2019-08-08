import React from "react"
import SessionList from "../components/SessionList/SessionList"
import Container from "react-bootstrap/Container"

const Sessions = ({ user }) => {
	return (
		<Container>
			<h2>List of sessions</h2>
			<SessionList user={user} />
		</Container>
	)
}

export default Sessions
