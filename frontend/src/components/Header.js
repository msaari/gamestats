import React from "react"
import { Link } from "react-router-dom"
import { Nav, Navbar, NavDropdown } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import LoginForm from "./LoginForm"

const Header = ({ user, setUser }) => {
	return (
		<Navbar bg="light" expand="lg">
			<Navbar.Brand>
				<Link to="/">Gamestats</Link>
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					<LinkContainer className="mr-4" to="/sessions">
						<Nav.Link>Sessions</Nav.Link>
					</LinkContainer>
					<LinkContainer className="mr-4" to="/add_session">
						<Nav.Link>New Session</Nav.Link>
					</LinkContainer>
					<LinkContainer className="mr-4" to="/games">
						<Nav.Link>Games</Nav.Link>
					</LinkContainer>
					<NavDropdown title="Misc" id="misc-elements">
						<LinkContainer to="/games/top100">
							<NavDropdown.Item>Top 100 candidates</NavDropdown.Item>
						</LinkContainer>
					</NavDropdown>
				</Nav>
				{!user && <LoginForm setUser={setUser} />}
				{user && <div>Hi, {user.username}!</div>}
			</Navbar.Collapse>
		</Navbar>
	)
}

export default Header
