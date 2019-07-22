import React from "react"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import Octicon, { Search } from "@primer/octicons-react"

const GameFilter = ({
	filterText,
	textChangeEvent,
	incompleteFilter,
	incompleteChangeEvent,
	expansionsFilter,
	expansionsChangeEvent
}) => {
	return (
		<Form>
			<Form.Row>
				<InputGroup>
					<InputGroup.Prepend>
						<InputGroup.Text id="basic-addon1">
							<Octicon icon={Search} />
						</InputGroup.Text>
					</InputGroup.Prepend>
					<Form.Control
						type="text"
						placeholder="Type something"
						value={filterText}
						onChange={textChangeEvent}
					/>
				</InputGroup>
			</Form.Row>
			<Form.Row>
				<Form.Check
					inline
					type="checkbox"
					id="incomplete"
					label="Incomplete games"
					value={incompleteFilter}
					onChange={incompleteChangeEvent}
				/>
				<Form.Check
					inline
					type="checkbox"
					id="expansions"
					label="Exclude expansions"
					value={expansionsFilter}
					onChange={expansionsChangeEvent}
				/>
			</Form.Row>
		</Form>
	)
}

export default GameFilter
