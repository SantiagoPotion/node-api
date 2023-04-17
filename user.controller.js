const Users = require('./user.model')


const User = {
    list: async (req, res) => {
        const users = await Users.find()
        res.status(200).send(users)
    },
    create: async (req, res) => {
        const user = new Users(req.body)
        await user.save();
        res.status(201).send('Created')
    },
    update: async (req, res) => {
        res.status(204).send('Updated')
    },
    destroy: async (req, res) => {
        const { id } = req.params
        const user = await Users.findOne({ _id: id })
        await user.remove()
        res.status(204).send('Deleted')
    }
}

module.exports = User