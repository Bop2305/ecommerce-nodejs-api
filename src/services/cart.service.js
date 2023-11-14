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
const { unselectPropertiesData } = require("../utils/appUtils")

class CartService {
    static async getOneCart({ query, select = unselectPropertiesData(['__v']) }) {
        const foundCart = await Cart.findOne(query)
            .select(select)
            .lean()

        if (!foundCart) throw new BadRequestErrorResponse('Cart not found')

        return foundCart
    }

    static async getOneCartItem({ query, select = unselectPropertiesData(['__v']) }) {
        const foundCartItem = await CartItem.findOne(query)
            .select(select)
            .lean()

        if (!foundCartItem) throw new BadRequestErrorResponse('Cart item not found')

        return foundCartItem
    }

    static async getCartItems({ query, select = unselectPropertiesData(['__v', 'cart_id']) }) {
        const cartItems = await CartItem.find(query)
            .select(select)
            .lean()

        if (!cartItems) throw new BadRequestErrorResponse('Cart is empty')

        return cartItems
    }

    static async updateOrInsertCart({ filter, update, option = { new: true }, select = unselectPropertiesData(['__v']) }) {
        const updateCart = await Cart.findOneAndUpdate(filter, update, option)
            .select(select)

        if (!updateCart) throw new BadRequestErrorResponse('Update cart failed')

        return updateCart
    }

    static async updateOrInsertCartItem({ filter, update, option = { new: true }, select = unselectPropertiesData(['__v']) }) {
        const updatedCartItem = await CartItem.findOneAndUpdate(filter, update, option)
            .select(select)

        if (!updatedCartItem) throw new BadRequestErrorResponse('Update cart item failed')

        return updatedCartItem
    }

    static async addCart({ userId, body }) {
        /**
         * Check cart
         * Add cart
         */
        const { product_id, quantity = 1 } = body

        const foundProduct = await getProductById({ productId: product_id })

        if (!foundProduct) throw new BadRequestErrorResponse('Product not found')

        const cart = await this.updateOrInsertCart({
            filter: { user_id: userId, cart_state: 'ACTIVE' },
            update: { $setOnInsert: { user_id: userId, cart_state: 'ACTIVE' } },
            option: { upsert: true, new: true }
        })

        await this.updateOrInsertCartItem({
            filter: { cart_id: cart.id, product_id },
            update: {
                product_name: foundProduct.product_name,
                product_price: foundProduct.product_price,
                $inc: { quantity: +quantity }
            },
            option: { new: true, upsert: true }
        })

        return cart
    }

    static async getListCart({ userId, cartState = 'ACTIVE' }) {
        const foundCart = await this.getOneCart({
            query: { user_id: userId, cart_state: cartState },
        })

        const cartItems = await this.getCartItems({
            query: { cart_id: foundCart._id }
        })

        return { ...foundCart, cartItems }
    }

    static async increaseQuantity({ userId, body }) {
        const { product_id, quantity = 1 } = body

        const foundCart = await this.getOneCart({
            query: { user_id: userId, cart_state: 'ACTIVE' },
        })

        /**
            const foundCartItem = await this.getOneCartItem({
                query: { cart_id: foundCart.id, product_id }
            })

            foundCartItem.quantity += Number(quantity)
            foundCartItem.save()
         */

        const foundCartItem = await this.getOneCartItem({
            query: { cart_id: foundCart._id, product_id }
        })

        const updatedCartItem = await this.updateOrInsertCartItem({
            filter: { _id: foundCartItem._id },
            update: { $inc: { quantity: +Number(quantity) } },
            option: { new: true }
        })

        return updatedCartItem
    }

    static async decreaseQuantity({ userId, body }) {
        const { product_id, quantity = 1 } = body

        const foundCart = await this.getOneCart({
            query: { user_id: userId, cart_state: 'ACTIVE' },
        })

        const foundCartItem = await this.getOneCartItem({
            query: { cart_id: foundCart._id, product_id }
        })

        if (foundCartItem.quantity < quantity || foundCartItem.quantity < 2) {
            return this.deleteCartItem({ userId, productId: product_id })
        }

        const updatedCartItem = await this.updateOrInsertCartItem({
            filter: { _id: foundCartItem._id },
            update: { $inc: { quantity: -Number(quantity) } },
            option: { new: true }
        })

        return updatedCartItem
    }

    static async deleteCart({ userId }) {
        const foundCart = await this.getOneCart({
            query: { user_id: userId, cart_state: 'ACTIVE' },
        })

        const deletedCart = await Cart.findByIdAndUpdate(foundCart._id, {
            cart_state: 'PENDING'
        })

        if (!deletedCart) throw new BadRequestErrorResponse('Delete cart failed')

        const result = await CartItem.deleteMany({ cart_id: foundCart._id })

        if (!result.acknowledged) throw new BadRequestErrorResponse('Delete cart item failed')

        return deletedCart
    }

    static async deleteCartItem({ userId, productId }) {
        const foundCart = await this.getOneCart({
            query: { user_id: userId, cart_state: 'ACTIVE' },
        })

        const foundCartItem = await this.getOneCartItem({
            query: { cart_id: foundCart._id, product_id: productId }
        })

        const deletedCartItem = await CartItem.findByIdAndRemove(foundCartItem._id)

        if (!deletedCartItem) throw new BadRequestErrorResponse('Delete cart item failed')

        return deletedCartItem
    }
}

module.exports = {
    CartService
}