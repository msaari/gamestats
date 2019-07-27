const mongoose = require("mongoose")

const sessionSchema = mongoose.Schema({
	game: String,
	date: Date,
	plays: Number,
	wins: Number,
	players: Number,
	ungeeked: Boolean
})

sessionSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id

		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model("Session", sessionSchema)
