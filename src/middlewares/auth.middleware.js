const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const Permission = require("../models/permission.model");
const { BadRequestErrorResponse, ForbiddenErrorResponse, AuthorizationErrorResponse } = require("../core/error.response");
const { getBlackListByUserId } = require("../services/blackList.service");
require('dotenv').config();

const secretKey = process.env.DEV_APP_SECRET_KEY;

const verifyToken = async (req, res, next) => {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) throw new AuthorizationErrorResponse()

    const accessToken = bearerToken.substring(7)

    const jwtDecoded = jwt.verify(accessToken, secretKey, (err, decoded) => {
        if (err) throw new AuthorizationErrorResponse()

        return decoded
    })

    const userId = jwtDecoded.id

    req.userId = jwtDecoded.id;
    req.accessToken = accessToken

    const foundBlackList = await getBlackListByUserId(userId)

    if(!foundBlackList) return next()

    const isBlackList = foundBlackList.tokens.includes(accessToken)

    if(isBlackList) throw new ForbiddenErrorResponse("Please log in again")

    next()
}

const checkRole = (roleName) => {
    return async (req, res, next) => {
        const userId = req.userId

        const user = await User.findById(userId)

        if (!user) throw new BadRequestErrorResponse("User not found")

        const role = await Role.findById(user.role)

        if (!role)  throw new ForbiddenErrorResponse("Role not found",) 

        if(role.name != roleName) throw new ForbiddenErrorResponse()

        req.permissions = role.permission

        return next()
    }
}

const checkPermission = (permissionName) => {
    return async (req, res, next) => {
        const permissionIds = req.permissions

        const allPermission = await Permission.findOne({ name: "All" })

        if (allPermission && permissionIds.includes(allPermission.id)) {
            return next()
        }

        const permission = await Permission.findOne({ name: permissionName })

        if (!permission) throw new ForbiddenErrorResponse()

        const hasPermission = permissionIds.includes(permission.id)

        if (!hasPermission) throw new ForbiddenErrorResponse()

        return next()
    }
}


module.exports = {
    verifyToken,
    checkRole,
    checkPermission
}