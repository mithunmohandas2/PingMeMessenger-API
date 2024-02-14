
const jwt = require('jsonwebtoken');

const createToken = async (_id) => {
    try {
        return await jwt.sign({ _id }, process.env.secretJWT, { expiresIn: '24h' });
    } catch (error) {
        return error.message;
    }
}

module.exports = createToken;