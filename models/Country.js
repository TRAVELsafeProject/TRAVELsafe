const mongoose = require('mongoose')
const Schema = mongoose.Schema

const countrySchema = new Schema(
    {
        name: {type: String, require: true},
        marriage: {type: String},
        workerProtections: {type: String},
        discriminationProtections: {type: String},
        violenceCriminalization: {type: String},
        adoption: {type: String},
        liveRating: {type: String},
        illegalRelationships: {type: String},
        propaganda: {type: String},
        comments: {type: String},
        dangerLevel: {type: String},
        usersRating: {type: Number},
        cityID: {type: Number}
    }
)

const Country = mongoose.model('Country', countrySchema)

module.exports = Country