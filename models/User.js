const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
	username: String,
	password: String
})

userSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id

		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model("User", userSchema)
