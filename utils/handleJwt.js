const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

// handleJwt.js - This function is necessary for auth-controller.js register()
const signToken = async (user) => {
    const sign = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '2h' })
    return sign
}

// handleJwt.js - This function is necessary for 'middleware' session.js authMiddleware()
const verifyToken = async (tokenJwt) => {
    try {
        return jwt.verify(tokenJwt, JWT_SECRET);
    } catch (e) {
        return null
    }
}

module.exports = { signToken, verifyToken };