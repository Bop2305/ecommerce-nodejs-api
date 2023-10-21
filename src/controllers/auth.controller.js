const { createUser, createAccessToken } = require("../services/auth.service");

const signUp = async (req, res, next) => {
    try {
        const user = req.body;
        const data = await createUser(user)
        return res.status(201).json({
            status: 201,
            message: "User registration successful",
            data: data
        })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error.message
        })
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const userId = req.body.userId
        const refreshToken = req.body.refreshToken
        const data = await createAccessToken(userId, refreshToken)
        return res.status(201).json({
            status: 201,
            message: "Access token created successful",
            data: data
        })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error.message
        })
    }
}

module.exports = {
    signUp,
    refreshToken,
}