const { unselectPropertiesData } = require("../../utils/appUtils")
const { Cart } = require("../cart.model")
const { CartItem } = require("../cartItem.model")

const getCartById = async (cartId) => {
    return await Cart.findOne({ id: cartId, cart_state: 'ACTIVE' })
        .select(unselectPropertiesData(['__v']))
}

const getDetailCartById = async ({cartId, select = unselectPropertiesData(['__v'])}) => {
    return await CartItem.find({ cart_id: cartId })
        .select(select)
        .lean()
}

module.exports = {
    getCartById,
    getDetailCartById
}