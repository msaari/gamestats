import React, { useState } from "react"
import DisplayText from "./DisplayText"
import sessionService from "../services/sessions"
import moment from "moment"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"

const dateParamString = dateParams => {
	let paramArray = []
	Object.keys(dateParams).forEach(key => {
		if (dateParams[key] !== null) paramArray.push(`${key}=${dateParams[key]}`)
	})
	return paramArray.join("&")
}

const dateParamHeading = dateParams => {
	let headingString = ""
	if (dateParams["month"]) {
		const time = moment(
			`${dateParams["month"]} ${dateParams["year"]}`,
			"MM YYYY"
		)
		headingString +=
			time.startOf("month").format("D.M.YYYY") +
			" – " +
			time.endOf("month").format("D.M.YYYY")
	} else if (dateParams["week"]) {
		const time = moment(
			`${dateParams["week"]} ${dateParams["year"]}`,
			"WW GGGG"
		)
		headingString +=
			time.startOf("week").format("D.M.YYYY") +
			" – " +
			time.endOf("week").format("D.M.YYYY")
	}
	return headingString
}

const BBCode = () => {
	const now = moment()
	const [dateParams, setDateParams] = useState({
		week: null,
		month: now.month() + 1,
		year: now.year()
	})

	const formHandler = event => {
		event.preventDefault()
		const year = event.target.year.value
			? parseInt(event.target.year.value)
			: now.year()
		const month = event.target.month.value
			? parseInt(event.target.month.value)
			: null
		let week = event.target.week.value
			? parseInt(event.target.week.value)
			: null
		if (week && month) week = null
		setDateParams({ week, month, year })
	}

	return (
		<>
			<Form onSubmit={formHandler}>
				<Form.Row>
					<Form.Group as={Col} md="3" controlId="week">
						<Form.Label>Week</Form.Label>
						<Form.Control type="number" placeholder="Week" />
					</Form.Group>
					<Form.Group as={Col} md="3" controlId="month">
						<Form.Label>Month</Form.Label>
						<Form.Control type="number" defaultValue={now.month() + 1} />
					</Form.Group>
					<Form.Group as={Col} md="3" controlId="year">
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
			<DisplayText
				service={sessionService}
				path="bbcode"
				params={dateParamString(dateParams)}
				heading={dateParamHeading(dateParams)}
			/>
		</>
	)
}

export default BBCode
