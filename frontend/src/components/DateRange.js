import React from "react"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import moment from "moment"

let setDateParams = null

const handleDateChange = event => {
	const now = moment()

	event.preventDefault()
	const fromYear = event.target.fromYear.value
		? parseInt(event.target.fromYear.value)
		: now.year()
	const fromMonth = event.target.fromMonth.value
		? parseInt(event.target.fromMonth.value)
		: null
	const fromDay = event.target.fromDay.value
		? parseInt(event.target.fromDay.value)
		: null
	const toYear = event.target.toYear.value
		? parseInt(event.target.toYear.value)
		: now.year()
	const toMonth = event.target.toMonth.value
		? parseInt(event.target.toMonth.value)
		: null
	const toDay = event.target.toDay.value
		? parseInt(event.target.toDay.value)
		: null
	setDateParams({ fromDay, fromMonth, fromYear, toDay, toMonth, toYear })
}

const DateRange = ({ paramSetter }) => {
	const from = moment()
	const to = moment()

	setDateParams = paramSetter

	return (
		<Form onSubmit={handleDateChange}>
			<Form.Row>
				<Form.Group as={Col} md="1" controlId="fromDay">
					<Form.Label>Day</Form.Label>
					<Form.Control
						type="number"
						defaultValue={from.startOf("month").format("D")}
					/>
				</Form.Group>
				<Form.Group as={Col} md="1" controlId="fromMonth">
					<Form.Label>Month</Form.Label>
					<Form.Control type="number" defaultValue={from.month() + 1} />
				</Form.Group>
				<Form.Group as={Col} md="2" controlId="fromYear">
					<Form.Label>Year</Form.Label>
					<Form.Control type="number" defaultValue={from.year()} />
				</Form.Group>
				<Form.Group as={Col} md="1" controlId="to">
					<Form.Label>&nbsp;</Form.Label>
					<Form.Control plaintext readOnly defaultValue="to" />
				</Form.Group>
				<Form.Group as={Col} md="1" controlId="toDay">
					<Form.Label>Day</Form.Label>
					<Form.Control type="number" defaultValue={to.date()} />
				</Form.Group>
				<Form.Group as={Col} md="1" controlId="toMonth">
					<Form.Label>Month</Form.Label>
					<Form.Control type="number" defaultValue={to.month() + 1} />
				</Form.Group>
				<Form.Group as={Col} md="2" controlId="toYear">
					<Form.Label>Year</Form.Label>
					<Form.Control type="number" defaultValue={to.year()} />
				</Form.Group>
				<Form.Group as={Col} md="3">
					<Form.Label>&nbsp;</Form.Label>
					<Button type="submit" variant="primary" block>
						Update
					</Button>
				</Form.Group>
			</Form.Row>
		</Form>
	)
}

export default DateRange
