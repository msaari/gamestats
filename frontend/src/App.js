import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"

import "./index.css"

import Header from "./components/Header"
import SessionList from "./components/SessionList"
import NewSessionForm from "./components/NewSessionForm"
import GameList from "./components/GameList"

import Container from "react-bootstrap/Container"

const Sessions = ({ user }) => {
	return (
		<Container>
			<h2>List of sessions</h2>
			<SessionList user={user} />
		</Container>
	)
}

const Games = () => {
	return (
		<div>
			<h2>List of games</h2>
			<GameList />
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
		}
	}, [])

	return (
		<Router>
			<Header user={user} setUser={setUser} />

			<Route path="/" exact render={() => <Home user={user} />} />
			<Route path="/add_session" render={() => <NewSession user={user} />} />
			<Route path="/sessions" render={() => <Sessions user={user} />} />
			<Route path="/games" component={Games} />
		</Router>
	)
}

export default App
