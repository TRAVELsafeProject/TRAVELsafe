const mongoose = require('mongoose');
const Country = require('../models/Country');

mongoose.connect(`mongodb+srv://TRAVELsafe:TravelSafePassword@cluster0.r7cqo.mongodb.net/TRAVELsafe?retryWrites=true&w=majority`);

const countries = [
    {
        name: 'Spain',
        marriage: 'Legal',
        workerProtections: 'Protection for sexual orientation only',
        discriminationProtections: 'Broad protections',
        violenceCriminalization: 'Hate crimes',
        adoption: 'Joint & Second-Parent adoption',
        liveRating: '76-100%',
        illegalRelationships: '',
        propaganda: '',
        comments: '',
        dangerLevel: 'A-',
        usersRating: ''
    }
]

Country.create(countries, (err) => {
    if (err) { throw(err) }
    console.log(`Created ${countries.length} countries`)
    mongoose.connection.close();
})