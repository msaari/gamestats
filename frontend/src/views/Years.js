import React from "react"
import PeriodList from "../components/PeriodList/PeriodList"
import Container from "react-bootstrap/Container"

const Years = () => {
	return (
		<Container>
			<h2>Years</h2>
			<PeriodList name="Year" />
		</Container>
	)
}

export default Years
