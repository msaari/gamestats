import React, { useState } from "react"
import loginService from "../services/login"
import AWN from "awesome-notifications"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"

const LoginForm = ({ setUser }) => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	const handleLogin = async event => {
		event.preventDefault()
		try {
			const user = await loginService.login({
				username,
				password
			})

			setUser(user)
			const notifier = new AWN()
			notifier.success(`Logged in as ${username}.`)
			window.localStorage.setItem("gamestatsLoggedUser", JSON.stringify(user))
		} catch (exception) {
			const notifier = new AWN()
			notifier.alert("Wrong credentials.")
		}
	}

	return (
		<Form inline onSubmit={handleLogin}>
			<Form.Control
				className="mr-sm-2"
				type="text"
				name="username"
				value={username}
				onChange={({ target }) => setUsername(target.value)}
				placeholder="Username"
			/>
			<Form.Control
				className="mr-sm-2"
				type="password"
				name="password"
				value={password}
				onChange={({ target }) => setPassword(target.value)}
				placeholder="Password"
			/>
			<Button type="submit" variant="outline-primary">
				Login
			</Button>
		</Form>
	)
}

export default LoginForm
