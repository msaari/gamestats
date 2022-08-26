import React, { useState, useEffect } from "react"
import DisplayText from "./DisplayText"
import { useAppState, useActions } from "../overmind"
import dayjs from "dayjs"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"

const dateParamString = dateParams => {
	let paramArray = []
	Object.keys(dateParams).forEach(key => {
		if (dateParams[key] !== null) paramArray.push(`${key}=${dateParams[key]}`)
	})
	return paramArray.join("&")
}

const dateParamHeading = dateParams => {
	let headingString = ""
	var customParseFormat = require('dayjs/plugin/customParseFormat')
	dayjs.extend(customParseFormat)

	if (dateParams["month"]) {
		const time = dayjs(
			`${dateParams["month"]} ${dateParams["year"]}`,
			["M YYYY", "MM YYYY"]
		)
		headingString +=
			time.startOf("month").format("D.M.YYYY") +
			" – " +
			time.endOf("month").format("D.M.YYYY")
	}
	return headingString
}

const BBCode = () => {
	const actions = useActions()
	const state = useAppState()
	const now = dayjs()
	const [dateParams, setDateParams] = useState({
		month: now.month() + 1,
		year: now.year()
	})

	useEffect(() => {
		actions.syncTotalPlays()
	}, [actions])

	useEffect(() => {
		actions.getBBCode(dateParamString(dateParams))
	}, [actions, dateParams])

	const formHandler = event => {
		event.preventDefault()
		const year = event.target.year.value
			? parseInt(event.target.year.value)
			: now.year()
		const month = event.target.month.value
			? parseInt(event.target.month.value)
			: null
		setDateParams({ month, year })
	}

	return (
		<>
			<Form onSubmit={formHandler}>
				<Form.Row>
					<Form.Group as={Col} md="4" controlId="month">
						<Form.Label>Month</Form.Label>
						<Form.Control type="number" defaultValue={now.month() + 1} />
					</Form.Group>
					<Form.Group as={Col} md="4" controlId="year">
						<Form.Label>Year</Form.Label>
						<Form.Control type="number" defaultValue={now.year()} />
					</Form.Group>
					<Form.Group as={Col} md="4">
						<Form.Label>&nbsp;</Form.Label>
						<Button type="submit" variant="primary" block>
							Update
						</Button>
					</Form.Group>
				</Form.Row>
			</Form>
			{state.isFetchingBBCode && (
				<Spinner animation="border" role="status">
					<span className="sr-only">Loading...</span>
				</Spinner>
			)}
			{!state.isFetchingBBCode && (
				<DisplayText
					data={state.bbCode}
					heading={dateParamHeading(dateParams)}
				/>
			)}
		</>
	)
}

export default BBCode
