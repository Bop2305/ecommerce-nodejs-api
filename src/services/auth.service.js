const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const User = require("../models/user.model")
const KeyToken = require("../models/keytoken.model")

// var secretKey = process.env.DEV_APP_SECRET_KEY

// Hash password
const encodePassword = async (password) => {
    const saltRounds = 10;

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw error;
    }
}

// Validate password
const comparePassword = async (password, hashPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashPassword);
        return isMatch;
    } catch (error) {
        throw error;
    }
}

const createUser = async (user) => {
    const secretKey = process.env.DEV_APP_SECRET_KEY
    const hashedPassword = await encodePassword(user.password)

    // Register user
    const newUser = new User({
        username: user.username,
        email: user.email,
        password: hashedPassword
    })

    await newUser.save()

    // Generate a access token
    const accessToken = jwt.sign({ username: user.username, email: user.email }, secretKey, {
        expiresIn: '1h',
    })

    // Generate a secret token
    const refreshToken = jwt.sign({ username: user.username, email: user.email }, secretKey, {
        expiresIn: '3d',
    })

    // Save secret token into database
    const findedUser = User.findOne({ email: user.email })

    const newRefreshToken = new KeyToken({
        refresh_token: refreshToken,
        user: findedUser.id,
    })

    await newRefreshToken.save()

    return {
        accessToken,
        refreshToken
    }

}

module.exports = {
    createUser
}