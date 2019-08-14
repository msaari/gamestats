import React from "react"
import Container from "react-bootstrap/Container"
import DisplayText from "./DisplayText"
import { useOvermind } from "../overmind"

const SyncResults = () => {
	const { actions, state } = useOvermind()

	return (
		<Container>
			<h2>BGG Rating Synchronisation</h2>
			<DisplayText action={actions.getSyncResults} data={state.syncResults} />
		</Container>
	)
}

export default SyncResults
