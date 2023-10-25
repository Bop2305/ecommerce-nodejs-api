const express = require('express')
const routes = express.Router()

const { signUp, refreshJwt, signIn, logout } = require('../../controllers/auth.controller')
const { verifyToken, checkRole, checkPermission } = require('../../middlewares/auth.middleware')
const { checkDuplicateUsernameOrEmail } = require('../../middlewares/verify.middleware')
const { asyncHandle } = require('../../helpers/async.handle')

routes.post('/sign-up',  asyncHandle(checkDuplicateUsernameOrEmail), asyncHandle(signUp))

routes.post('/sign-in', asyncHandle(signIn))

routes.post('/refresh-token', asyncHandle(refreshJwt))

routes.get('/logout', asyncHandle(verifyToken), asyncHandle(logout))

routes.get('', [asyncHandle(verifyToken), asyncHandle(checkRole('User')), asyncHandle(checkPermission('Read'))], (req, res) => {
    return res.status(200).json({
        status: 200,
        message: 'OK'
    })
})

module.exports = routes