const BlackListToken = require("../models/blackListToken.model")

const addBlackListToken = async (userId, token) => {
    const blackListToken = await BlackListToken.findOneAndUpdate({ user: userId }, {
        $push: { tokens: token }
    }, {
        new: true,
        upsert: true
    })

    return blackListToken
}

const getBlackListByUserId = async (userId) => {
    const foundBlackList = await BlackListToken.findOne({user: userId}) || null
    return foundBlackList
}

module.exports = {
    addBlackListToken,
    getBlackListByUserId
}