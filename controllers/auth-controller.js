const bcrypt = require('bcrypt')
const usersModel = require('../models/user.model')
const { signToken } = require('../utils/handleJwt');




const Auth = {
    register: async (req, res) => {
        const { body } = req // body = req.body
        try {
            const isUser = await usersModel.findOne({ email: body.email })
            if (isUser) {
                res.status(409).send("User already exists");
            } else {
                const salt = await bcrypt.genSalt()
                const hashed = await bcrypt.hash(body.password, salt)
                const user = await usersModel.create({ email: body.email, password: hashed, salt })
                
                const signed = await signToken(user._id) // This must to have 'await'
                res.status(200).json({ token: signed })
                //res.send(signed)
            }
        } catch (e) {
            res.status(500).send(e.message)
        }
    },
    login: async (req, res) => {
        const { body } = req
        try {
            const user = await usersModel.findOne( { email: body.email })           // We search the user in db by his email
            if(!user) {                                                             // We ask if the user exists
                res.status(401).send("User doesn't exist");
            } else {                                                                // If not, we create it
                const isMatch = await bcrypt.compare(body.password, user.password)  // We compare the request pass and the database user pass.
                if(isMatch) {                                                       // We ask if both passwords match
                    const signed = await signToken(user._id)                        // If so, we sign his token, we need 'await'
                    console.log(signed)
                    //res.status(200).send(signed)
                    res.status(200).json({ token: signed })
                } else {
                    res.status(401).send('Invalid password')                        // If not, we throw an error
                }
            }
        } catch (err) {
            res.send(err.message)
        }
    },
}

module.exports = Auth;