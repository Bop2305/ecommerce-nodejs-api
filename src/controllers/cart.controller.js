const { CreatedSuccessResponse } = require("../core/success.response")
const { CartService } = require("../services/cart.service")

const addCart = async (req, res) => {
    const userId = req.userId
    const body = req.body

    const cart = await CartService.addCart({ userId, body })

    new CreatedSuccessResponse({ message: 'Add cart success', data: { cart } }).send(res)
}

module.exports = {
    addCart
}