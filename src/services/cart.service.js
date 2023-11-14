/**
 * Add product to cart
 * Increase product quantity
 * Decrease product quantity
 * Get list to cart
 * Delete cart
 * Delete cart item
 */

const { Cart } = require("../models/cart.model")
const { CartItem } = require("../models/cartItem.model")
const { BadRequestErrorResponse } = require("../core/error.response")
const { getProductById } = require("../models/repositories/product.repo")

class CartService {
    static async addCart({ userId, body }) {
        /**
         * Check cart
         * Add cart
         */

        const {
            product_id,
            quantity
        } = body

        const foundProduct = await getProductById({ productId: product_id })

        if (!foundProduct) throw new BadRequestErrorResponse('Product not found')

        const cart = await Cart.findOne({
            user_id: userId,
            cart_state: 'ACTIVE'
        })

        if (!cart) {
            cart = await Cart.create({
                user_id: userId,
                cart_state: 'ACTIVE'
            })
        }

        const cartItem = await CartItem.findOneAndUpdate({
            cart_id: cart.id,
            product_id
        }, {
            $inc: { quantity: +quantity }
        }, { new: true, upsert: true })

        if (!cartItem) throw new BadRequestErrorResponse('Add cart failed')

        return cart
    }

    static async getListCart() {

    }

    static async increaseQuantity() {

    }

    static async decreaseQuantity() {

    }

    static async deleteCart() {

    }

    static async deleteCartItem() {

    }
}

module.exports = {
    CartService
}