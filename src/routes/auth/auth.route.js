const express = require('express')
const { signUp, refreshJwt, signIn } = require('../../controllers/auth.controller')
const { verifyToken, isAdmin, checkRole, checkPermission } = require('../../middlewares/auth.middleware')
const { checkDuplicateUsernameOrEmail } = require('../../middlewares/verify.middleware')
const routes = express.Router()

routes.post('/sign-up', checkDuplicateUsernameOrEmail, signUp)

routes.post('/sign-in', signIn)

routes.post('/refresh-token', refreshJwt)

routes.get('', [verifyToken, checkRole('User'), checkPermission('Update')], (req, res) => {
    return res.status(200).json({
        status: 200,
        message: 'OK'
    })
})

module.exports = routes