import React from "react"
import { Link } from "react-router-dom"
import { Nav, Navbar, NavItem } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useAuth0 } from "../react-auth0-wrapper"

const Header = () => {
	const { isAuthenticated, loginWithRedirect, logout } = useAuth0()

	console.log(loginWithRedirect, useAuth0)
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
			<div>
				{!isAuthenticated && (
					<button onClick={() => loginWithRedirect({})}>Log in</button>
				)}

				{isAuthenticated && <button onClick={() => logout()}>Log out</button>}
			</div>
		</Navbar>
	)
}

export default Header
