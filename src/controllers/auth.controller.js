const { createUser } = require("../services/auth.service");

const signUp = async (req, res, next) => {
    const user = req.body;
    try {
        const data = await createUser(user)
        return res.status(201).json({
            status: 201,
            message: "User registration successful",
            data: data
        })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error.message
        })
    }
}

module.exports = {
    signUp
}