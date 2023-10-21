const User = require("../models/user.model")

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    const email = req.body.email
    const username = req.body.username
    try {
        const emailUser = await User.findOne({ email })

        if (emailUser) {
            return res.status(400).json({
                status: 400,
                message: "Email already exists"
            })
        }

        const usernameUser = await User.findOne({ username })

        if (usernameUser) {
            return res.status(400).json({
                status: 400,
                message: "Email already exists"
            })
        }

        next()
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error.message
        })
    }
}

module.exports = {
    checkDuplicateUsernameOrEmail
}