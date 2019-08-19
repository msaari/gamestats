import React from "react"
import FiftyPlaysList from "../components/FiftyPlaysList/FiftyPlaysList"
import Container from "react-bootstrap/Container"

const FiftyPlays = () => {
	return (
		<Container>
			<h2>Fifty plays list</h2>
			<FiftyPlaysList />
		</Container>
	)
}

export default FiftyPlays
