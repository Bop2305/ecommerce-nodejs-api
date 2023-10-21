const express = require('express')
const { signUp, refreshToken, signIn } = require('../../controllers/auth.controller')
const { verifyToken } = require('../../middlewares/auth.middleware')
const routes = express.Router()

routes.post('/sign-up', signUp)

routes.post('/sign-in', signIn)

routes.post('/refresh-token', refreshToken)

routes.get('', verifyToken, (req, res) => {
    return res.status(200).json({
        status: 200,
        message: 'OK'
    })
})

module.exports = routes