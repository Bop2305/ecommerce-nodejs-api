const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const Permission = require("../models/permission.model");
require('dotenv').config();

const secretKey = process.env.DEV_APP_SECRET_KEY;

const verifyToken = async (req, res, next) => {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(400).json({
            status: 403,
            message: "No token provided!"
        })
    }

    const accessToken = bearerToken.substring(7)

    jwt.verify(accessToken, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: 401,
                message: "Authorization "
            })
        }

        req.userId = decoded.id;

        return next()
    })
}

const checkRole = (roleName) => {
    return async (req, res, next) => {
        const userId = req.userId

        try {
            const user = await User.findById(userId)

            if (!user) {
                return res.status(404).json({
                    status: 404,
                    message: "User not found"
                })
            }

            const role = await Role.findById(user.role)

            if (!role) {
                return res.status(404).json({
                    status: 404,
                    message: "Role not found"
                })
            }

            if (role.name != roleName) {
                return res.status(403).json({
                    status: 403,
                    message: "Forbidden"
                })
            }

            req.permissions = role.permission

            return next()
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message
            })
        }
    }
}

const checkPermission = (permissionName) => {
    return async (req, res, next) => {
        const permissionIds = req.permissions

        try {
            const allPermission = await Permission.findOne({ name: "All" })

            if (allPermission && permissionIds.includes(allPermission.id)) {
                return next()
            }

            const permission = await Permission.findOne({ name: permissionName })

            if (!permission) {
                return res.status(403).json({
                    status: 403,
                    message: "Forbidden"
                })
            }

            const hasPermission = permissionIds.includes(permission.id)

            if (!hasPermission) {
                return res.status(403).json({
                    status: 403,
                    message: "Forbidden"
                })
            }

            return next()
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message
            })
        }
    }
}


module.exports = {
    verifyToken,
    checkRole,
    checkPermission
}