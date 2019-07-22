import axios from "axios"
const baseUrl = "/api/sessions"

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

const create = async newObject => {
	let response = null
	response = await axios.post(baseUrl, newObject)
	return response.data
}

const update = async (id, newObject) => {
	const response = await axios.put(`${baseUrl}/${id}`, newObject)
	return response.data
}

const deleteSession = async id => {
	const response = await axios.delete(`${baseUrl}/${id}`)
	return response.data
}
export default {
	getAll,
	getSome,
	create,
	update,
	deleteSession
}
