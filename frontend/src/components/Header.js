import React from "react"
import { Link } from "react-router-dom"
import { Nav, Navbar, NavDropdown } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import LoginForm from "./LoginForm"
import { useOvermind } from "../overmind"

const Header = () => {
	const { state } = useOvermind()

	return (
		<Navbar bg="light" expand="lg" className="mb-3">
			<Navbar.Brand>
				<Link to="/">Gamestats</Link>
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					<LinkContainer exact className="mr-4" to="/sessions">
						<Nav.Link>Sessions</Nav.Link>
					</LinkContainer>
					<LinkContainer className="mr-4" to="/add_session">
						<Nav.Link>New Session</Nav.Link>
					</LinkContainer>
					<NavDropdown className="mr-4" title="Games" id="game-dropdown">
						<LinkContainer exact to="/games">
							<NavDropdown.Item>All games</NavDropdown.Item>
						</LinkContainer>
						<LinkContainer to="/games/top100">
							<NavDropdown.Item>Top 100 candidates</NavDropdown.Item>
						</LinkContainer>
						<LinkContainer to="/games/firstplays">
							<NavDropdown.Item>First plays</NavDropdown.Item>
						</LinkContainer>
						<LinkContainer to="/games/fiftyplays">
							<NavDropdown.Item>Fifty plays</NavDropdown.Item>
						</LinkContainer>
					</NavDropdown>
					<NavDropdown title="Misc" id="misc-elements">
						<LinkContainer to="/sessions/bbcode">
							<NavDropdown.Item>BBCode sessions</NavDropdown.Item>
						</LinkContainer>
						<LinkContainer to="/sync">
							<NavDropdown.Item>Sync BGG ratings</NavDropdown.Item>
						</LinkContainer>
					</NavDropdown>
				</Nav>
				{!state.user && <LoginForm />}
				{state.user && <div>Hi, {state.user.username}!</div>}
			</Navbar.Collapse>
		</Navbar>
	)
}

export default Header
