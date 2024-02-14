const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

const protect = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["authorization"];
    try {
        if (!token) return res.status(401).json({ message: 'Token misssing, Unauthorized' })
        const decode = jwt.verify(token, process.env.secretJWT)
        req.user = decode
    } catch (error) {
        return res.status(401).json({ message: 'invalid token' });
    }
    return next();
}

module.exports = {
    protect
}