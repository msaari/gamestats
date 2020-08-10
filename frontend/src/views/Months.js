import React from "react"
import PeriodList from "../components/PeriodList/PeriodList"
import Container from "react-bootstrap/Container"

const Months = () => {
	return (
		<Container>
			<h2>Months</h2>
			<PeriodList name="Month" />
		</Container>
	)
}

export default Months
