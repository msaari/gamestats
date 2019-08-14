import React from "react"
import SyncResults from "../components/SyncResults"
import Container from "react-bootstrap/Container"
import { useOvermind } from "../overmind"

const Sync = () => {
	const { state } = useOvermind()

	return (
		<Container>
			{state.user !== null ? <SyncResults /> : <p>Please log in!</p>}
		</Container>
	)
}

export default Sync
