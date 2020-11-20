const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema(
    {
      commemtTitle: {type: String}, // Limitar un máximo de caracteres
      comment: {type: String}, // Limitar un máximo de caracteres
      rating: {type: Number},
      userID: {type: Schema.Types.ObjectId},
      cityID: {type: Number}
    }
)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment