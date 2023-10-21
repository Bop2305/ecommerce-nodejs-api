require('dotenv').config();

const User = require("../models/user.model")
const { authUtils } = require("../utils");

const createUser = async (user) => {
    const hashedPassword = await authUtils.encodePassword(user.password)

    const newUser = new User({
        username: user.username,
        email: user.email,
        password: hashedPassword,
        role: user.role
    })

    await newUser.save()

    return newUser
}

const getUserByEmail = async (email) => {
    const user = await User.findOne({ email })

    return user
}

module.exports = {
    createUser,
    getUserByEmail
}