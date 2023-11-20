const { BadRequestErrorResponse } = require("../core/error.response");
const { getDetailCartById } = require("../models/repositories/cart.repo");
const { selectPropertiesData } = require("../utils/appUtils");
const { CartService } = require("./cart.service");
const { DiscountService } = require("./discount.service");

class CheckoutService {
    static async checkoutReview({ userId, shopOrderIds, cartId }) {
        /**
         * params: userId: string, shopOrderIds: {shopId, discountId}[], cartId: string
         * feature: check cart, get order after apply discount, fee ship, tax
         */

        //Set default fee ship and tax
        const feeShip = 10
        const tax = 10
        let discountAmount = 0

        const foundCart = await CartService.getOneCart({ _id: cartId, user_id: userId, cart_state: 'ACTIVE' })

        if (!foundCart) throw new BadRequestErrorResponse('Cart not found')

        const cartItems = await getDetailCartById({ cartId, select: selectPropertiesData(['product_id', 'quantity', 'product_price']) })

        if (!cartItems) throw new BadRequestErrorResponse('Cart is empty')

        let initialPrice = cartItems.reduce((sum, currentValue) => {
            sum += currentValue.product_price * currentValue.quantity

            return sum
        }, 0)

        for (const index in shopOrderIds) {
            const shopId = shopOrderIds[index].shopId

            if (!shopId) throw BadRequestErrorResponse('Shop not exist')

            const discountId = shopOrderIds[index].discountId

            if (discountId) {
                const totalOrder = cartItems.map(item => {
                    return {
                        productId: item.product_id,
                        price: item.product_price,
                        quantity: item.quantity
                    }
                })

                const discountDetails = await DiscountService.getDiscountAmount({
                    userId,
                    shopId,
                    discountId,
                    totalOrder
                })

                discountAmount = discountDetails.discountAmount
            }
        }

        let totalPrice = Math.floor(initialPrice - discountAmount - feeShip - (initialPrice * tax) / 100)

        if (totalPrice < 0) throw new BadRequestErrorResponse('Checkout wrong')

        return {
            discountAmount,
            totalPrice
        }
    }
}

module.exports = {
    CheckoutService
}