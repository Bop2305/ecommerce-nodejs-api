const { OKSuccessResponse } = require("../core/success.response")
const { CheckoutService } = require("../services/checkout.service")

const checkoutReview = async (req, res) => {
    const userId = req.userId
    const cartId = req.body.cartId
    const shopOrderIds = req.body.shopOrderIds

    const {
        discountAmount,
        totalPrice
    } = await CheckoutService.checkoutReview({userId, cartId, shopOrderIds})

    new OKSuccessResponse({message: 'OK', data: {discountAmount, totalPrice}}).send(res)
}

module.exports = {
    checkoutReview
}