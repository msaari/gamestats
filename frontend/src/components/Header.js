import React from "react"
import { Link } from "react-router-dom"
import { Nav, Navbar, NavItem } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"

const Header = () => {
	return (
		<Navbar bg="light" expand="lg">
			<Navbar.Brand>
				<Link to="/">Gamestats</Link>
			</Navbar.Brand>
			<Nav>
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
		</Navbar>
	)
}

export default Header
