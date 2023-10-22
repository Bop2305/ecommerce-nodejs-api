const { BadRequestErrorResponse } = require("../core/error.response")
const User = require("../models/user.model")

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    const email = req.body.email
    const username = req.body.username

    const emailUser = await User.findOne({ email })

    if (emailUser) throw new BadRequestErrorResponse("Email already exists")

    const usernameUser = await User.findOne({ username })

    if (usernameUser) throw new BadRequestErrorResponse("Username already exists")

    next()
}

module.exports = {
    checkDuplicateUsernameOrEmail
}