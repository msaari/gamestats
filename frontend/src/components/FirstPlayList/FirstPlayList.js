import React, { useEffect } from "react"
import Table from "react-bootstrap/Table"
import Spinner from "react-bootstrap/Spinner"
import Accordion from "react-bootstrap/Accordion"
import Card from "react-bootstrap/Card"
import { useOvermind } from "../../overmind"
import dayjs from "dayjs"

const FirstPlayList = () => {
	const { state, actions } = useOvermind()

	useEffect(() => {
		actions.getFirstPlays()
	}, [actions])

	const createYearAccordion = (currentYear, yearCounter, yearSessions) => (
		<Card key={currentYear}>
			<Accordion.Toggle as={Card.Header} eventKey={currentYear}>
				<h3>{currentYear}</h3> Total: {yearCounter}
			</Accordion.Toggle>
			<Accordion.Collapse eventKey={currentYear}>
				<Card.Body>
					<Table striped responsive>
						<thead>
							<tr>
								<th>#</th>
								<th>Game</th>
								<th>Date</th>
								<th>Cumulative</th>
							</tr>
						</thead>
						<tbody>{yearSessions}</tbody>
					</Table>
				</Card.Body>
			</Accordion.Collapse>
		</Card>
	)

	let totalCounter = 0
	let yearCounter = 0
	let currentYear = false
	const accordionCards = []
	let yearSessions = []
	state.firstPlays.forEach(row => {
		const date = dayjs(row.date)
		if (date.year() !== currentYear) {
			if (currentYear) {
				accordionCards[currentYear] = createYearAccordion(
					currentYear,
					yearCounter,
					yearSessions
				)
				yearSessions = []
			}
			currentYear = date.year()
			yearCounter = 0
		}
		yearCounter += 1
		totalCounter += 1
		const sessionRow = (
			<tr key={totalCounter}>
				<td>{yearCounter}</td>
				<td>{row.game}</td>
				<td>{date.format("D.M.YYYY")}</td>
				<td>{totalCounter}</td>
			</tr>
		)
		yearSessions.push(sessionRow)
	})
	accordionCards[currentYear] = createYearAccordion(
		currentYear,
		yearCounter,
		yearSessions
	)

	return (
		<>
			{state.isFetchingFirstPlays && (
				<Spinner animation="border" role="status">
					<span className="sr-only">Loading...</span>
				</Spinner>
			)}
			{!state.isFetchingFirstPlays && <Accordion>{accordionCards}</Accordion>}
		</>
	)
}

export default FirstPlayList
