const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema(
    {
      cityID: {type: Number},
      userID: {type: Number},
      comment: {type: String},
      rating: {type: Number}
    }
)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment