const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema(
    {
      commentTitle: {type: String}, 
      comment: {type: String}, 
      rating: {type: Number},
      userID: {type: Schema.Types.ObjectId},
      name: {type: String},
      lastName: {type: String},
      cityName: {type: String}
    }
)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment