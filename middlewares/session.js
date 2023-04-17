const { verifyToken } = require('../utils/handleJwt');
const { handleHttpError } = require('../utils/handleError');

// Middleware - session
const authMiddleware = async (req, res, next) => {
    try {
        if(!req.headers.authorization){
            handleHttpError(res, "NEED_SESSION", 401);
            return
        }

        // verify token
        const token = req.headers.authorization.split(' ').pop();
        const dataToken = await verifyToken(token);

        
        if(!dataToken){
            handleHttpError(res, "NOT_PAYLOAD_DATA", 401);
            return
        }


        // find and assign user
        const user = await usersModel.findById(dataToken._id)
        if(!user) {
            return res.status(401).end()
        }
        req.user = user
        next()
    } catch (e) {
        handleHttpError(res, "NOT_SESSION", 401);
    }
}

module.exports = authMiddleware;