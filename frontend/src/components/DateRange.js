import React from "react"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import moment from "moment"

const DateRange = ({ formHandler }) => {
	const now = moment()

	return (
		<Form onSubmit={formHandler}>
			<Form.Row>
				<Form.Group as={Col} md="1" controlId="fromDay">
					<Form.Label>Day</Form.Label>
					<Form.Control
						type="number"
						defaultValue={now.startOf("month").format("D")}
					/>
				</Form.Group>
				<Form.Group as={Col} md="1" controlId="fromMonth">
					<Form.Label>Month</Form.Label>
					<Form.Control type="number" defaultValue={now.month() + 1} />
				</Form.Group>
				<Form.Group as={Col} md="2" controlId="fromYear">
					<Form.Label>Year</Form.Label>
					<Form.Control type="number" defaultValue={now.year()} />
				</Form.Group>
				<Form.Group as={Col} md="1" controlId="to">
					<Form.Label>&nbsp;</Form.Label>
					<Form.Control plaintext readOnly defaultValue="to" />
				</Form.Group>
				<Form.Group as={Col} md="1" controlId="toDay">
					<Form.Label>Day</Form.Label>
					<Form.Control type="number" defaultValue={now.date()} />
				</Form.Group>
				<Form.Group as={Col} md="1" controlId="toMonth">
					<Form.Label>Month</Form.Label>
					<Form.Control type="number" defaultValue={now.month() + 1} />
				</Form.Group>
				<Form.Group as={Col} md="2" controlId="toYear">
					<Form.Label>Year</Form.Label>
					<Form.Control type="number" defaultValue={now.year()} />
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
