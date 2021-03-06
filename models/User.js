const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        name: {type: String, require: true},
        lastName: {type: String, require: true},
        email: {type: String, require: true},
        password: {type: String, require: true},
        alreadyVisited: {type: [String], default: []},
        wishVisit: {type: [String], default: []},
        comments: {type: [String], default: []}
    }
)

const User = mongoose.model('User', userSchema)

module.exports = User