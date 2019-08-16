import React, { useState } from "react"
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
	const to = moment()

	const [defaultValues, setDefaultValues] = useState({
		fromDay: 1,
		fromMonth: 1,
		fromYear: 2001,
		toDay: to.date(),
		toMonth: to.month() + 1,
		toYear: to.year()
	})

	const handleInputChange = event => {
		const target = event.target
		const value = target.value
		const name = target.name

		const newValues = {
			...defaultValues,
			[name]: parseInt(value)
		}
		setDefaultValues(newValues)
	}

	const setDate = mode => {
		const today = moment()
		switch (mode) {
			case "alltime":
				setDefaultValues({
					fromDay: 1,
					fromMonth: 1,
					fromYear: 2001,
					toDay: today.date(),
					toMonth: today.month() + 1,
					toYear: today.year()
				})
				break
			case "12months": {
				const yearAgo = moment().subtract(1, "years")

				setDefaultValues({
					fromDay: yearAgo.date(),
					fromMonth: yearAgo.month() + 1,
					fromYear: yearAgo.year(),
					toDay: today.date(),
					toMonth: today.month() + 1,
					toYear: today.year()
				})
				break
			}
			case "thisyear": {
				const thisYear = moment().startOf("year")

				setDefaultValues({
					fromDay: thisYear.date(),
					fromMonth: thisYear.month() + 1,
					fromYear: thisYear.year(),
					toDay: today.date(),
					toMonth: today.month() + 1,
					toYear: today.year()
				})
				break
			}
			case "lastyear": {
				const lastYear = moment()
					.subtract(1, "years")
					.startOf("year")
				const endOfLastYear = moment()
					.subtract(1, "years")
					.endOf("year")

				setDefaultValues({
					fromDay: lastYear.date(),
					fromMonth: lastYear.month() + 1,
					fromYear: lastYear.year(),
					toDay: endOfLastYear.date(),
					toMonth: endOfLastYear.month() + 1,
					toYear: endOfLastYear.year()
				})
				break
			}
			case "thisquarter": {
				const thisQuarter = moment().startOf("quarter")

				setDefaultValues({
					fromDay: thisQuarter.date(),
					fromMonth: thisQuarter.month() + 1,
					fromYear: thisQuarter.year(),
					toDay: today.date(),
					toMonth: today.month() + 1,
					toYear: today.year()
				})
				break
			}
			default:
				setDefaultValues({
					fromDay: 1,
					fromMonth: 1,
					fromYear: 2001,
					toDay: to.date(),
					toMonth: to.month() + 1,
					toYear: to.year()
				})
		}
	}

	setDateParams = paramSetter

	return (
		<Form onSubmit={handleDateChange} className="mt-4 mb-5">
			<Form.Row>
				<Form.Group as={Col} xs="4" sm="1" controlId="fromDay">
					<Form.Label>Day</Form.Label>
					<Form.Control
						type="number"
						onChange={handleInputChange}
						name="fromDay"
						value={defaultValues.fromDay}
					/>
				</Form.Group>
				<Form.Group as={Col} xs="4" sm="1" controlId="fromMonth">
					<Form.Label>Month</Form.Label>
					<Form.Control
						type="number"
						onChange={handleInputChange}
						name="fromMonth"
						value={defaultValues.fromMonth}
					/>
				</Form.Group>
				<Form.Group as={Col} xs="4" sm="2" controlId="fromYear">
					<Form.Label>Year</Form.Label>
					<Form.Control
						type="number"
						onChange={handleInputChange}
						name="fromYear"
						value={defaultValues.fromYear}
					/>
				</Form.Group>
				<Form.Group
					as={Col}
					sm="1"
					className="d-none d-sm-block"
					controlId="to"
				>
					<Form.Label>&nbsp;</Form.Label>
					<Form.Control plaintext readOnly defaultValue="to" />
				</Form.Group>
				<Form.Group as={Col} xs="4" sm="1" controlId="toDay">
					<Form.Label>Day</Form.Label>
					<Form.Control
						type="number"
						onChange={handleInputChange}
						name="toDay"
						value={defaultValues.toDay}
					/>
				</Form.Group>
				<Form.Group as={Col} xs="4" sm="1" controlId="toMonth">
					<Form.Label>Month</Form.Label>
					<Form.Control
						type="number"
						onChange={handleInputChange}
						name="toMonth"
						value={defaultValues.toMonth}
					/>
				</Form.Group>
				<Form.Group as={Col} xs="4" sm="2" controlId="toYear">
					<Form.Label>Year</Form.Label>
					<Form.Control
						type="number"
						onChange={handleInputChange}
						name="toYear"
						value={defaultValues.toYear}
					/>
				</Form.Group>
				<Form.Group as={Col} sm="3">
					<Form.Label className="d-none d-sm-block">&nbsp;</Form.Label>
					<Button type="submit" variant="primary" block>
						Update
					</Button>
				</Form.Group>
			</Form.Row>
			<Form.Row>
				<Col xs="4" sm="2">
					<Button
						block
						onClick={() => setDate("alltime")}
						variant="outline-primary"
					>
						All time
					</Button>
				</Col>
				<Col xs="4" sm="2">
					<Button
						block
						onClick={() => setDate("12months")}
						variant="outline-primary"
					>
						12 months
					</Button>
				</Col>
				<Col xs="4" sm="2">
					<Button
						block
						onClick={() => setDate("thisyear")}
						variant="outline-primary"
					>
						This year
					</Button>
				</Col>
				<Col xs="4" sm="2">
					<Button
						block
						onClick={() => setDate("lastyear")}
						variant="outline-primary"
					>
						Last year
					</Button>
				</Col>
				<Col xs="4" sm="2">
					<Button
						block
						onClick={() => setDate("thisquarter")}
						variant="outline-primary"
					>
						Quarter
					</Button>
				</Col>
			</Form.Row>
		</Form>
	)
}

export default DateRange
