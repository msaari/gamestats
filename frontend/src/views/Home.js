import React from "react"
import NewSessionForm from "../components/SessionList/Session/NewSessionForm/NewSessionForm"
import Container from "react-bootstrap/Container"
import { useAppState } from "../overmind"

const Home = () => {
	const state = useAppState()

	return (
		<Container>
			{state.user !== null ? <NewSessionForm /> : <p>Please log in!</p>}
		</Container>
	)
}

export default Home
