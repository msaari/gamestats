import React, { useEffect } from "react"
import Container from "react-bootstrap/Container"
import DisplayText from "./DisplayText"
import { useOvermind } from "../overmind"

const SyncTotalsResults = () => {
	const { actions, state } = useOvermind()
	useEffect(() => {
		actions.getSyncTotalsResults()
	}, [actions])

	return (
		<Container>
			<h2>Total Plays Synchronisation</h2>
			<DisplayText heading="Results" data={state.syncTotalsResults} />
		</Container>
	)
}

export default SyncTotalsResults
