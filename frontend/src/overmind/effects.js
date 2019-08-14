import axios from "axios"

export class Api {
	constructor(baseUrl, request) {
		this.baseUrl = baseUrl
		this.request = request
		this.token = null
	}

	initialize = () => {
		const loggedUserJSON = window.localStorage.getItem("gamestatsLoggedUser")
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			this.token = user.token
		}
	}

	setToken = newToken => {
		this.token = `Bearer ${newToken}`
	}

	getAll = async () => {
		const response = await axios.get(this.baseUrl)
		return response.data
	}

	getSome = async limit => {
		const response = await axios.get(this.baseUrl, {
			params: { limit, order: "desc" }
		})
		return response.data
	}

	getPath = async (path, params = null) => {
		params = params ? "?" + params : ""
		const response = await axios.get(this.baseUrl + "/" + path + params)
		return response.data
	}

	getWithToken = async (path, params = null) => {
		console.log(this.token)
		const config = {
			headers: { Authorization: this.token }
		}
		params = params ? "?" + params : ""

		console.log(config)
		const response = await axios.get(this.baseUrl + "/" + path + params, config)
		return response.data
	}

	create = async newObject => {
		const config = {
			headers: { Authorization: this.token }
		}

		let response = null
		response = await axios.post(this.baseUrl, newObject, config)
		return response.data
	}

	update = async (id, newObject) => {
		const config = {
			headers: { Authorization: this.token }
		}

		const response = await axios.put(`${this.baseUrl}/${id}`, newObject, config)
		return response.data
	}

	deleteItem = async id => {
		const config = {
			headers: { Authorization: this.token }
		}

		const response = await axios.delete(`${this.baseUrl}/${id}`, config)
		return response.data
	}
}

export const sessions = new Api("/api/sessions", axios)
export const games = new Api("/api/games", axios)
export const sync = new Api("/api/sync", axios)
