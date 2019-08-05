import axios from "axios"
const baseUrl = "/api/sync"

let token = null

const setToken = newToken => {
	token = `Bearer ${newToken}`
}

const getPath = async () => {
	const config = {
		headers: { Authorization: token }
	}

	const response = await axios.get(baseUrl, config)
	return response.data
}

export default {
	getPath,
	setToken
}
