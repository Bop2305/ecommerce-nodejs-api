const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require('dotenv').config();

const User = require("../models/user.model")
const KeyToken = require("../models/keytoken.model");

const secretKey = process.env.DEV_APP_SECRET_KEY;
const secretKeyRefreshToken = process.env.DEV_APP_SECRET_KEY_REFRESH_TOKEN
const expiredAccessToken = process.env.DEV_EXPIRED_ACCESS_TOKEN
const expiredRefreshToken = process.env.DEV_EXPIRED_REFRESH_TOKEN

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

// Compare password
const comparePassword = async (password, hashPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashPassword);
        return isMatch;
    } catch (error) {
        throw error;
    }
}

// Generate a access token
const generateAccessToken = (user) => {
    const accessToken = jwt.sign({ username: user.username, email: user.email }, secretKey, {
        expiresIn: expiredAccessToken,
    })

    return accessToken
}

// Generate a refresh token
const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({ username: user.username, email: user.email }, secretKeyRefreshToken, {
        expiresIn: expiredRefreshToken,
    })

    return refreshToken
}

const createUser = async (user) => {
    const hashedPassword = await encodePassword(user.password)

    // Create a new user
    const newUser = new User({
        username: user.username,
        email: user.email,
        password: hashedPassword
    })

    await newUser.save()

    const accessToken = generateAccessToken(user)

    const refreshToken = generateRefreshToken(user)

    // Save the refresh token into the database
    const findedUser = await User.findOne({ email: user.email })

    const newRefreshToken = new KeyToken({
        refresh_token: refreshToken,
        user: findedUser.id,
    })

    await newRefreshToken.save()

    return {
        user: findedUser,
        accessToken,
        refreshToken
    }

}

const createAccessToken = async (userId, refreshToken) => {
    const keyToken = await KeyToken.findOne({ user: userId, refresh_token: refreshToken }).sort({ create_at: -1 })

    if (!keyToken) {
        throw new Error('Jwt token not found')
    }

    return jwt.verify(keyToken.refresh_token, secretKeyRefreshToken, (err, decode) => {
        if (err) {
            throw err
        } else {
            const accessToken = generateAccessToken(decode)

            return accessToken
        }
    })
}

module.exports = {
    createUser,
    createAccessToken
}