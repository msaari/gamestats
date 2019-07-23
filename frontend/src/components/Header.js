import React from "react"
import { Link } from "react-router-dom"
import { Nav, Navbar, NavItem } from "react-bootstrap"
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
					<LinkContainer to="/sessions">
						<NavItem>Sessions</NavItem>
					</LinkContainer>
					<LinkContainer to="/add_session">
						<NavItem>New Session</NavItem>
					</LinkContainer>
					<LinkContainer to="/games">
						<NavItem>Games</NavItem>
					</LinkContainer>
				</Nav>
				{!user && <LoginForm setUser={setUser} />}
			</Navbar.Collapse>
		</Navbar>
	)
}

export default Header
