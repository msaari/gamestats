import React from "react"
import SyncTotalsResults from "../components/SyncTotalsResults"
import Container from "react-bootstrap/Container"
import { useOvermind } from "../overmind"

const SyncTotals = () => {
	const { state } = useOvermind()

	return (
		<Container>
			{state.user !== null ? <SyncTotalsResults /> : <p>Please log in!</p>}
		</Container>
	)
}

export default SyncTotals
