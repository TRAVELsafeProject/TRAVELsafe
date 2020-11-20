const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        // username: {type: String, require: true},
        email: {type: String, require: true},
        password: {type: String, require: true},
        visitedCountry: {type: [String]},
        pendingCountry: {type: [String]},
        comments: {type: [String]}
    }
)

const User = mongoose.model('User', userSchema)

module.exports = User