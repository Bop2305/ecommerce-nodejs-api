require('dotenv').config();

const KeyToken = require("../models/keytoken.model");
const { authUtils } = require("../utils");

const createRefreshToken = async (user) => {
    const refreshToken = authUtils.generateRefreshToken(user)

    const hashRefreshToken = await authUtils.encodeRefreshToken(refreshToken)

    await KeyToken.findOneAndUpdate({user: user.id}, {$push: {refresh_token: hashRefreshToken}}, {
        new: true,
        upsert: true
    })

    return refreshToken
}

const getRefreshTokenByUserId = async (userId,) => {
    const keyToken = await KeyToken.findOne({ user: userId })

    return keyToken
}

module.exports = {
    createRefreshToken,
    getRefreshTokenByUserId,
}