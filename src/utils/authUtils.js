const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
require('dotenv').config();

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
    const accessToken = jwt.sign({id: user.id, username: user.username, email: user.email, role: user.role}, secretKey, {
        expiresIn: expiredAccessToken,
    })

    return accessToken
}

// Generate a refresh token
const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({id: user.id, username: user.username, email: user.email, role: user.role}, secretKeyRefreshToken, {
        expiresIn: expiredRefreshToken,
    })

    return refreshToken
}

// Hash refresh token
const encodeRefreshToken = async (refreshToken) => {
    const saltRounds = 10;

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashRefreshToken = await bcrypt.hash(refreshToken, salt);
        return hashRefreshToken;
    } catch (error) {
        throw error;
    }
}

// Compare password
const compareRefreshToken = async (refreshToken, hashRefreshToken) => {
    try {
        const isMatch = await bcrypt.compare(refreshToken, hashRefreshToken);
        return isMatch;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    encodePassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    encodeRefreshToken,
    compareRefreshToken
}