const jwt = require("jsonwebtoken");
require('dotenv').config();

const secretKey = process.env.DEV_APP_SECRET_KEY;

const verifyToken = async (req, res, next) => {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(400).json({
            status: 403,
            message: "No token provided!"
        })
    }

    const accessToken = bearerToken.substring(7)

    jwt.verify(accessToken, secretKey, (err, decode) => {
        if (err) {
            return res.status(401).json({
                status: 401,
                message: "Authorization "
            })
        }

        return next()
    })
}

module.exports = {
    verifyToken
}