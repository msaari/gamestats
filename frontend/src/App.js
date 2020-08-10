import React, { useEffect } from "react"
import { HashRouter as Router, Route } from "react-router-dom"

import "./index.css"

import Home from "./views/Home"
import Games from "./views/Games"
import NewSession from "./views/NewSession"
import Sessions from "./views/Sessions"
import Months from "./views/Months"
import Years from "./views/Years"
import Sync from "./views/Sync"
import SyncTotals from "./views/SyncTotals"
import BBCodes from "./views/BBCodes"
import FirstPlays from "./views/FirstPlays"
import FiftyPlays from "./views/FiftyPlays"

import Header from "./components/Header"

import { useOvermind } from "./overmind"

const App = () => {
	const { actions } = useOvermind()

	useEffect(() => {
		actions.setupUser()
	}, [actions])

	return (
		<Router>
			<Header />
			<Route path="/" exact render={() => <Home />} />
			<Route path="/add_session" render={() => <NewSession />} />
			<Route path="/sessions" exact render={() => <Sessions />} />
			<Route
				path="/sessions/bbcode"
				render={(routeProps) => <BBCodes {...routeProps} />}
			/>
			<Route
				path="/games"
				exact
				render={(routeProps) => <Games {...routeProps} />}
			/>
			<Route
				path="/games/top100"
				exact
				render={(routeProps) => <Games {...routeProps} />}
			/>
			<Route
				path="/games/firstplays"
				exact
				render={(routeProps) => <FirstPlays {...routeProps} />}
			/>
			<Route
				path="/games/fiftyplays"
				exact
				render={(routeProps) => <FiftyPlays {...routeProps} />}
			/>
			<Route
				path="/months"
				exact
				render={(routeProps) => <Months {...routeProps} />}
			/>
			<Route
				path="/years"
				exact
				render={(routeProps) => <Years {...routeProps} />}
			/>
			<Route
				path="/sync"
				exact
				render={(routeProps) => <Sync {...routeProps} />}
			/>
			<Route
				path="/sync/totalplays"
				exact
				render={(routeProps) => <SyncTotals {...routeProps} />}
			/>
		</Router>
	)
}

export default App
