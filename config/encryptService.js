const bcrypt = require('bcrypt');

const hashData = async (data, saltRounds = 10) => {
    try {
        const hashedData = await bcrypt.hash(data, saltRounds);
        return hashedData;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

const verifyHashData = async (unhashed, hashed) => {
    try {
        const match = await bcrypt.compare(unhashed, hashed);
        return match;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

module.exports = {
    hashData,
    verifyHashData,
}