import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"

import "./index.css"

import Home from "./views/Home"
import Games from "./views/Games"
import NewSession from "./views/NewSession"
import Sessions from "./views/Sessions"
import Sync from "./views/Sync"
import BBCodes from "./views/BBCodes"

import Header from "./components/Header"

import gameService from "./services/games"
import sessionService from "./services/sessions"

const App = props => {
	const [user, setUser] = useState(null)

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("gamestatsLoggedUser")
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			gameService.setToken(user.token)
			sessionService.setToken(user.token)
		}
	}, [])

	return (
		<Router>
			<Header user={user} setUser={setUser} />
			<Route path="/" exact render={() => <Home user={user} />} />
			<Route path="/add_session" render={() => <NewSession user={user} />} />
			<Route path="/sessions" exact render={() => <Sessions user={user} />} />
			<Route
				path="/sessions/bbcode"
				render={routeProps => <BBCodes {...routeProps} />}
			/>
			<Route
				path="/games"
				exact
				render={routeProps => <Games user={user} {...routeProps} />}
			/>
			<Route
				path="/games/top100"
				exact
				render={routeProps => <Games user={user} {...routeProps} />}
			/>
			<Route
				path="/sync"
				exact
				render={routeProps => <Sync user={user} {...routeProps} />}
			/>
		</Router>
	)
}

export default App
