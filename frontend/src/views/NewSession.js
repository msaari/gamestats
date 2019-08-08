import React from "react"
import NewSessionForm from "../components/SessionList/Session/NewSessionForm/NewSessionForm"
import Container from "react-bootstrap/Container"

const NewSession = ({ user }) => {
	return (
		<Container>
			<h2>Add a session</h2>
			{user !== null ? <NewSessionForm /> : <p>Please log in!</p>}
		</Container>
	)
}

export default NewSession
