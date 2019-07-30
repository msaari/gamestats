import axios from "axios"
const baseUrl = "/api/sessions"

let token = null

const setToken = newToken => {
	token = `Bearer ${newToken}`
}

const getAll = async () => {
	const response = await axios.get(baseUrl)
	return response.data
}

const getSome = async limit => {
	const response = await axios.get(baseUrl, {
		params: { limit, order: "desc" }
	})
	return response.data
}

const getPath = async (path, params = null) => {
	params = params ? "?" + params : ""
	const response = await axios.get(baseUrl + "/" + path + params)
	return response.data
}

const create = async newObject => {
	const config = {
		headers: { Authorization: token }
	}

	let response = null
	response = await axios.post(baseUrl, newObject, config)
	return response.data
}

const update = async (id, newObject) => {
	const config = {
		headers: { Authorization: token }
	}

	const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
	return response.data
}

const deleteSession = async id => {
	const config = {
		headers: { Authorization: token }
	}

	const response = await axios.delete(`${baseUrl}/${id}`, config)
	return response.data
}

export default {
	getAll,
	getSome,
	getPath,
	create,
	update,
	deleteSession,
	setToken
}
