import React from "react"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"

const SessionDate = ({ date }) => {
	let day = String(date.getDate())
	let month = String(date.getMonth() + 1)
	let year = date.getFullYear()

	const today = new Date()
	let currentDay = String(today.getDate())
	let currentMonth = String(today.getMonth() + 1)
	let currentYear = today.getFullYear()

	return (
		<Form.Row>
			<Form.Group as={Col} sm="3" controlId="dateDD">
				<Form.Label>DD</Form.Label>
				<Form.Control
					type="number"
					defaultValue={day}
					placeholder={currentDay}
				/>
			</Form.Group>
			<Form.Group as={Col} sm="3" controlId="dateMM">
				<Form.Label>MM</Form.Label>
				<Form.Control
					type="number"
					defaultValue={month}
					placeholder={currentMonth}
				/>
			</Form.Group>
			<Form.Group as={Col} sm="6" controlId="dateYY">
				<Form.Label>YY</Form.Label>
				<Form.Control
					type="number"
					defaultValue={year}
					placeholder={currentYear}
				/>
			</Form.Group>
		</Form.Row>
	)
}

export default SessionDate
