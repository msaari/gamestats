import React from "react"
import Container from "react-bootstrap/Container"
import DisplayText from "./DisplayText"
import syncService from "../services/sync"

const SyncResults = ({ user }) => {
	syncService.setToken(user.token)

	return (
		<Container>
			<h2>BGG Rating Synchronisation</h2>
			<DisplayText service={syncService} path="/sync" />
		</Container>
	)
}

export default SyncResults
