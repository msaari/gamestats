import { useState, useEffect } from "react"
import axios from "axios"

export const useResource = baseUrl => {
	const [resources, setResources] = useState([])
	const [token, setToken] = useState("")

	useEffect(() => {
		async function getResources() {
			const response = await axios.get(baseUrl)
			setResources(response.data)
		}
		getResources()
	}, [baseUrl])

	const create = async resource => {
		const config = {
			headers: { Authorization: `bearer ${token}` }
		}

		const response = await axios.post(baseUrl, resource, config)
		const newResources = resources.concat(response.data)
		setResources(newResources)
		return response.data
	}

	const update = async (id, resource) => {
		const config = {
			headers: { Authorization: `bearer ${token}` }
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
			headers: { Authorization: `bearer ${token}` }
		}

		await axios.delete(`${baseUrl}/${id}`, config)
		const newResources = resources.filter(r => r.id !== id)
		setResources(newResources)
	}

	const service = {
		create,
		setToken,
		update,
		deleteResource
	}

	return [resources, service]
}
