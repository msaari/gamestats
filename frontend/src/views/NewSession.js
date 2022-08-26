import React from "react"
import NewSessionForm from "../components/SessionList/Session/NewSessionForm/NewSessionForm"
import Container from "react-bootstrap/Container"
import { useAppState } from "../overmind"

const NewSession = () => {
	const { state } = useAppState()

	return (
		<Container>
			<h2>Add a session</h2>
			{state.user !== null ? <NewSessionForm /> : <p>Please log in!</p>}
		</Container>
	)
}

export default NewSession
