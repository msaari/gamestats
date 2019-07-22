import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"

import Header from "./components/Header"
import SessionList from "./components/SessionList"
import NewSessionForm from "./components/NewSessionForm"
import GameList from "./components/GameList"

import "./index.css"

const Sessions = () => {
	return (
		<div>
			<h2>List of sessions</h2>
			<SessionList />
		</div>
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

const Home = () => {
	return (
		<>
			<h1>Gamestats</h1>
			<NewSessionForm />
		</>
	)
}

const NewSession = () => {
	return (
		<>
			<h2>Add a session</h2>
			<NewSessionForm />
		</>
	)
}

const App = props => {
	return (
		<Router>
			<Header />

			<Route path="/" exact component={Home} />
			<Route path="/add_session" component={NewSession} />
			<Route path="/sessions" component={Sessions} />
			<Route path="/games" component={Games} />
		</Router>
	)
}

export default App
