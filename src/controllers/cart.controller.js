const { CreatedSuccessResponse, OKSuccessResponse } = require("../core/success.response")
const { CartService } = require("../services/cart.service")

const addCart = async (req, res) => {
    const userId = req.userId
    const body = req.body

    const cart = await CartService.addCart({ userId, body })

    new CreatedSuccessResponse({ message: 'Add cart success', data: { cart } }).send(res)
}

const getListCart = async (req, res) => {
    const userId = req.userId
    const cartState = req.body.cartState

    const cart = await CartService.getListCart({ userId, cartState })

    new OKSuccessResponse({ message: 'OK', data: { cart } }).send(res)
}

const increaseQuantity = async (req, res) => {
    const userId = req.userId
    const body = req.body
    const updatedCartItem = await CartService.increaseQuantity({ userId, body })

    new OKSuccessResponse({ message: 'Increase cart item success', data: { updatedCartItem } }).send(res)
}

const decreaseQuantity = async (req, res) => {
    const userId = req.userId
    const body = req.body

    const updatedCartItem = await CartService.decreaseQuantity({ userId, body })

    new OKSuccessResponse({ message: 'Decrease cart item success', data: { updatedCartItem } }).send(res)
}

const deleteCart = async (req, res) => {
    const userId = req.userId

    const deletedCart = await CartService.deleteCart({ userId })

    new OKSuccessResponse({ message: 'Delete cart success', data: { deletedCart } }).send(res)
}

const deleteCartItem = async (req, res) => {
    const userId = req.userId
    const productId = req.params.productId

    const deleteCartItem = await CartService.deleteCartItem({ userId, productId })

    new OKSuccessResponse({ message: 'Delete cart item success', data: { deleteCartItem } }).send(res)
}

module.exports = {
    addCart,
    getListCart,
    increaseQuantity,
    decreaseQuantity,
    deleteCart,
    deleteCartItem
}