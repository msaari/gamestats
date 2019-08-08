import React from "react"
import NewSessionForm from "../components/SessionList/Session/NewSessionForm/NewSessionForm"
import Container from "react-bootstrap/Container"

const Home = ({ user }) => {
	return (
		<Container>
			{user !== null ? <NewSessionForm /> : <p>Please log in!</p>}
		</Container>
	)
}

export default Home
