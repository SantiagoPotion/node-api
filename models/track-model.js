const mongoose = require('mongoose')

const Tracks = mongoose.model('Tracks', {
    name: { type: String, required: true, minLength: 5 },
    album: { type: String, required: true },
})

module.exports = Tracks