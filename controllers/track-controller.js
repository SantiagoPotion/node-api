const tracksModel = require('../models/track-model');
const { handleHttpError } = require('../utils/handleError');

const Tracks = {
    list: async (req, res) => {
        const tracks = await tracksModel.find()
        res.status(200).send(tracks)
    },
    create: async (req, res) => {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }

        const track = new tracksModel(req.body)
        await track.save()
        res.status(201).json(track)     
    },
    update: async (req, res) => {
        res.status(204).send('Updated')
    },
    destroy: async (req, res) => {
        const { id } = req.params
        const track = await tracksModel.findOne({ _id: id })
        await track.remove()
        res.status(204).send('Deleted')
    }
}

module.exports = Tracks;