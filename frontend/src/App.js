import React, { useEffect } from "react"
import { HashRouter as Router, Route } from "react-router-dom"

import "./index.css"

import Home from "./views/Home"
import Games from "./views/Games"
import NewSession from "./views/NewSession"
import Sessions from "./views/Sessions"
import Sync from "./views/Sync"
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
				render={routeProps => <BBCodes {...routeProps} />}
			/>
			<Route
				path="/games"
				exact
				render={routeProps => <Games {...routeProps} />}
			/>
			<Route
				path="/games/top100"
				exact
				render={routeProps => <Games {...routeProps} />}
			/>
			<Route
				path="/games/firstplays"
				exact
				render={routeProps => <FirstPlays {...routeProps} />}
			/>
			<Route
				path="/games/fiftyplays"
				exact
				render={routeProps => <FiftyPlays {...routeProps} />}
			/>
			<Route
				path="/sync"
				exact
				render={routeProps => <Sync {...routeProps} />}
			/>
		</Router>
	)
}

export default App
