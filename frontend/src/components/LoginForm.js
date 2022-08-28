import React, { useState } from "react"
import AWN from "awesome-notifications"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useActions } from "../overmind"

const LoginForm = () => {
	const actions = useActions()

	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	const handleLogin = async event => {
		event.preventDefault()
		try {
			await actions.login({ username, password })
			const notifier = new AWN()
			notifier.success(`Logged in as ${username}.`)
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
