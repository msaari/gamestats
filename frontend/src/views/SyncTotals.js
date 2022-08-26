import React from "react"
import SyncTotalsResults from "../components/SyncTotalsResults"
import Container from "react-bootstrap/Container"
import { useAppState } from "../overmind"

const SyncTotals = () => {
	const { state } = useAppState()

	return (
		<Container>
			{state.user !== null ? <SyncTotalsResults /> : <p>Please log in!</p>}
		</Container>
	)
}

export default SyncTotals
