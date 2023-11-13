const { BadRequestErrorResponse } = require("../core/error.response")
const { Discount } = require("../models/discount.model");
const { getAllProduct } = require("../models/repositories/product.repo");
const { removeUndefinedObject, unselectPropertiesData } = require("../utils/appUtils");
const { validateDiscountDates, isDiscountNotStarted, isDiscountExpired } = require("../utils/discountUtils");

class DiscountService {
    static async createDiscount({ shopId, body }) {
        /**
         * Check discount code not exsits
         * Validate start time and end time
         */
        const {
            discount_name, discount_description, discount_code, discount_type, is_published = true,
            discount_is_active, discount_value, discount_min_order_value, discount_max_quantity,
            discount_products_applied = [], discount_max_quantity_per_user, discount_start_date, discount_end_date, discount_applies_to
        } = body

        const foundDiscount = await Discount.findOne({
            discount_code,
            discount_shop: shopId
        })

        if (foundDiscount) throw new BadRequestErrorResponse('Discount code already exists')

        validateDiscountDates(discount_start_date, discount_end_date)

        const discount = await Discount.create({
            discount_name,
            discount_description,
            discount_code,
            discount_type,
            is_published,
            discount_is_active,
            discount_value,
            discount_min_order_value,
            discount_max_quantity,
            discount_products_applied,
            discount_max_quantity_per_user,
            discount_start_date,
            discount_end_date,
            discount_applies_to,
            discount_shop: shopId
        })

        return discount

    }

    static async updateDiscount({ shopId, discountId, body }) {
        removeUndefinedObject(body)

        const foundDiscount = await Discount.findOne({
            _id: discountId,
            discount_shop: shopId
        })

        const {
            discount_start_date,
            discount_end_date
        } = body

        if (!foundDiscount) throw new BadRequestErrorResponse('Discount not found')

        validateDiscountDates(discount_start_date, discount_end_date)

        const updatedDiscount = await Discount.updateOne({ _id: discountId }, body, {
            new: true
        })

        return updatedDiscount
    }

    static async getAllDiscount(shopId) {
        const discounts = await Discount.find({
            discount_shop: shopId,
            is_published: true,
            discount_is_active: true
        }).select(unselectPropertiesData(['__v', 'create_at'])).lean()

        return discounts
    }

    static async getListProductByDiscount(discountId) {
        const foundDiscount = await Discount.findOne({
            _id: discountId,
            is_published: true,
            discount_is_active: true
        })

        if (!foundDiscount) throw new BadRequestErrorResponse("Discount not found")

        const products = []

        if (foundDiscount.discount_applies_to === 'ALL') {
            products = await getAllProduct({
                limit: 1000,
                filter: { user: foundDiscount.discount_shop },
                select: unselectPropertiesData(['_id', '__v'])
            })

            return products
        }

        products = getAllProduct({
            filter: {
                _id: { $in: foundDiscount.discount_products_applied }
            },
            limit: 1000,
            select: unselectPropertiesData(['_id', '__v'])
        })

        return products
    }

    static async getDiscountAmount({ userId, discountId, totalOrder }) {
        let totalPriceBeforeDiscount = 0
        let totalPriceAppliedDiscount = 0
        let discountAmount = 0
        let totalPriceAfterDiscount = 0

        totalPriceBeforeDiscount = totalOrder.reduce((sum, currentValue) => {
            sum += currentValue.price * currentValue.quantity

            return sum
        }, 0)

        totalPriceAppliedDiscount = totalPriceBeforeDiscount

        const foundDiscount = await Discount.findOne({
            _id: discountId,
            discount_is_active: true,
            is_published: true
        })

        if (!foundDiscount) throw new BadRequestErrorResponse("Discount code not found")

        const {
            discount_used_count,
            discount_max_quantity,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_type,
            discount_value,
            discount_users_used,
            discount_max_quantity_per_user,
            discount_applies_to,
            discount_products_applied
        } = foundDiscount


        if (isDiscountNotStarted(discount_start_date)) throw new BadRequestErrorResponse('Invalid discount code')

        if (isDiscountExpired(discount_end_date)) throw new BadRequestErrorResponse('Discount code is expired')

        if (discount_used_count > discount_max_quantity) throw new BadRequestErrorResponse('Discount code is expired')

        const countUserUsed = discount_users_used.filter(id => id === userId).length

        if (countUserUsed >= discount_max_quantity_per_user) throw new BadRequestErrorResponse('Discount code is expired')

        if (totalOrder < discount_min_order_value) {
            throw new BadRequestErrorResponse(`Minimum order value ${discount_min_order_value}`)
        }

        //Properties totalOrder: productId, price, quantity

        if (discount_applies_to !== 'ALL') {
            totalPriceAppliedDiscount = totalOrder.reduce((sum, currentValue) => {
                if (discount_products_applied.includes(currentValue.productId)) {
                    sum += currentValue.price * currentValue.quantity
                }

                return sum
            }, 0)
        }

        if (discount_type === 'PERCENTAGE') {
            discountAmount = (totalPriceAppliedDiscount * discount_value) / 100
        } else {
            discountAmount = discount_value
        }

        totalPriceAfterDiscount = totalPriceBeforeDiscount - discountAmount

        return {
            discountAmount,
            totalPriceAfterDiscount
        }
    }

    static async deleteDiscount({ shopId, discountId }) {
        const deletedDiscount = await Discount.findOneAndRemove({
            _id: discountId,
            discount_shop: shopId
        })

        return deletedDiscount
    }

    static async cancelDiscount({ shopId, userId, discountId }) {
        const foundDiscount = await Discount.findOne({
            _id: discountId,
            discount_shop: shopId
        })

        if (!foundDiscount) throw new BadRequestErrorResponse('Discount code not found')

        const updatedDiscount = await Discount.updateOne({
            _id: discountId
        }, {
            $pull: { discount_users_used: userId },
            $inc: {
                discount_max_quantity: +1,
                discount_used_count: -1
            },
        }, { new: true })

        return updatedDiscount
    }
}

module.exports = {
    DiscountService
}