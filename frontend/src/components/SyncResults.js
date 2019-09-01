import React, { useEffect } from "react"
import Container from "react-bootstrap/Container"
import DisplayText from "./DisplayText"
import { useOvermind } from "../overmind"

const SyncResults = () => {
	const { actions, state } = useOvermind()
	useEffect(() => {
		actions.getSyncResults()
	}, [actions])

	return (
		<Container>
			<h2>BGG Rating Synchronisation</h2>
			<DisplayText heading="Results" data={state.syncResults} />
		</Container>
	)
}

export default SyncResults
