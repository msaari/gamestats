import axios from "axios"
const baseUrl = "/api/games"

let token = null

const setToken = newToken => {
	token = `Bearer ${newToken}`
}

const getAll = async () => {
	const response = await axios.get(baseUrl)
	return response.data
}

const getPath = async path => {
	const response = await axios.get(baseUrl + "/" + path)
	return response.data
}

const create = async newObject => {
	const config = {
		headers: { Authorization: token }
	}

	const response = await axios.post(baseUrl, newObject, config)
	return response.data
}

const update = async (id, newObject) => {
	const config = {
		headers: { Authorization: token }
	}

	const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
	return response.data
}

const deleteGame = async id => {
	const config = {
		headers: { Authorization: token }
	}

	const response = await axios.delete(`${baseUrl}/${id}`, config)
	return response.data
}
export default {
	getAll,
	getPath,
	create,
	update,
	deleteGame,
	setToken
}
