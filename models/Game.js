const mongoose = require("mongoose")

const gameSchema = mongoose.Schema({
	name: String,
	designers: Array,
	publisher: Array,
	year: Number,
	owned: Boolean,
	bgg: Number,
	rating: Number,
	length: Number,
	parent: String,
	totalPlays: Number
})

gameSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id

		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model("Game", gameSchema)
