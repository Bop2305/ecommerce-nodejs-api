const jwt = require("jsonwebtoken");
const { createUser, getUserByEmail } = require("../services/auth.service");
const { createRefreshToken, getRefreshTokenByUserId } = require('../services/token.service')
const { authUtils, appUtils } = require("../utils");
const { BadRequestErrorResponse, AuthorizationErrorResponse } = require("../core/error.response");
const { OKSuccessResponse, CreatedSuccessResponse } = require("../core/success.response");

const secretKeyRefreshToken = process.env.DEV_APP_SECRET_KEY_REFRESH_TOKEN

const signUp = async (req, res) => {
    const user = req.body

    const createdUser = await createUser(user)

    const returnedUser = appUtils.pickProperties(createdUser, ['id', 'username', 'email', 'role'])

    const accessToken = authUtils.generateAccessToken(returnedUser)

    const refreshToken = await createRefreshToken(createdUser)

    const data = {
        user: returnedUser,
        accessToken,
        refreshToken
    }

    new CreatedSuccessResponse({ message: "User registration successful", data })
}

const refreshJwt = async (req, res) => {
    const userId = req.body.userId
    const refreshToken = req.body.refreshToken

    const token = await getRefreshTokenByUserId(userId)

    let isMatchRefreshToken = false

    if (token) {
        isMatchRefreshToken = await authUtils.compareRefreshToken(refreshToken, token.refresh_token.slice(-1)[0])
    }

    if (!token || !isMatchRefreshToken) throw new AuthorizationErrorResponse("Token not found or does not match")

    jwt.verify(refreshToken, secretKeyRefreshToken, (err, decode) => {
        if (err) {
            throw new AuthorizationErrorResponse("Email or password incorrect")
        } else {
            const accessToken = authUtils.generateAccessToken(decode)

            new CreatedSuccessResponse({ message: "Access token created successfully", data: accessToken }).send(res)
        }
    })
}

const signIn = async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const user = await getUserByEmail(email)

    let isMatchPassword = false

    if (user) {
        isMatchPassword = await authUtils.comparePassword(password, user.password)
    }

    if (!user || !isMatchPassword) throw new BadRequestErrorResponse("Email or password incorrect")

    const returnedUser = appUtils.pickProperties(user, ['id', 'username', 'email', 'role'])

    const accessToken = authUtils.generateAccessToken(returnedUser)

    const refreshToken = await createRefreshToken(returnedUser)

    const data = {
        user: returnedUser,
        accessToken,
        refreshToken
    }

    new OKSuccessResponse({ data: data, message: "Sign in success" }).send(res)
}

module.exports = {
    signUp,
    refreshJwt,
    signIn,
}