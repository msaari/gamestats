import React from "react"
import SyncResults from "../components/SyncResults"
import Container from "react-bootstrap/Container"

const Sync = ({ user }) => {
	return (
		<Container>
			{user !== null ? <SyncResults user={user} /> : <p>Please log in!</p>}
		</Container>
	)
}

export default Sync
