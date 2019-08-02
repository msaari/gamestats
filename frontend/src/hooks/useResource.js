import { useState, useEffect } from "react"
import axios from "axios"

export const useResource = baseUrl => {
	const [resources, setResources] = useState([])
	const [token, setToken] = useState("")

	useEffect(() => {
		async function getResources() {
			let params = {}
			if (baseUrl === "/api/sessions") {
				params = {
					limit: 20,
					order: "desc"
				}
			}
			const response = await axios.get(baseUrl, { params })
			setResources(response.data)
		}
		getResources()
	}, [baseUrl])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("gamestatsLoggedUser")
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setToken(user.token)
		}
	}, [])

	const getPath = async (path, params = null) => {
		params = params ? "?" + params : ""
		const response = await axios.get(baseUrl + "/" + path + params)
		const newResources = response.data
		setResources(newResources)
		return response.data
	}

	const create = async resource => {
		const config = {
			headers: { Authorization: `Bearer ${token}` }
		}

		const response = await axios.post(baseUrl, resource, config)
		const newResources = resources.concat(response.data)
		setResources(newResources)
		return response.data
	}

	const update = async (id, resource) => {
		const config = {
			headers: { Authorization: `Bearer ${token}` }
		}
		const response = await axios.put(`${baseUrl}/${id}`, resource, config)
		const newResources = resources
			.filter(r => r.id !== id)
			.concat(response.data)
		setResources(newResources)
		return response.data
	}

	const deleteResource = async id => {
		const config = {
			headers: { Authorization: `Bearer ${token}` }
		}

		await axios.delete(`${baseUrl}/${id}`, config)
		const newResources = resources.filter(r => r.id !== id)
		setResources(newResources)
	}

	const service = {
		create,
		getPath,
		setToken,
		update,
		deleteResource
	}

	return [resources, service]
}
