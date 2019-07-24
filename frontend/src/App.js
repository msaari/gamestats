import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"

import "./index.css"

import Header from "./components/Header"
import SessionList from "./components/SessionList"
import NewSessionForm from "./components/NewSessionForm"
import GameList from "./components/GameList"

import gameService from "./services/games"
import sessionService from "./services/sessions"

import Container from "react-bootstrap/Container"

const Sessions = ({ user }) => {
	return (
		<Container>
			<h2>List of sessions</h2>
			<SessionList user={user} />
		</Container>
	)
}

const Games = ({ match, user }) => {
	const path = match.path.replace(/\/games\/?/, "")
	return (
		<div>
			<h2>List of games</h2>
			<GameList path={path} user={user} />
		</div>
	)
}

const Home = ({ user }) => {
	return (
		<Container>
			{user !== null ? <NewSessionForm /> : <p>Please log in!</p>}
		</Container>
	)
}

const NewSession = ({ user }) => {
	return (
		<Container>
			<h2>Add a session</h2>
			{user !== null ? <NewSessionForm /> : <p>Please log in!</p>}
		</Container>
	)
}

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
			<Route path="/sessions" render={() => <Sessions user={user} />} />
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
		</Router>
	)
}

export default App
