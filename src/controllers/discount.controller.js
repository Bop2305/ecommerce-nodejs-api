const { BadRequestErrorResponse } = require("../core/error.response")
const { CreatedSuccessResponse, OKSuccessResponse } = require("../core/success.response")
const { DiscountService } = require("../services/discount.service")

const createDiscount = async (req, res) => {
    const shopId = req.userId
    const body = req.body

    const discount = await DiscountService.createDiscount({ shopId, body })

    if (!discount) throw new BadRequestErrorResponse('Create discount failed')

    new CreatedSuccessResponse({ message: 'Create discount success', data: { discount } }).send(res)
}

const updateDiscount = async (req, res) => {
    const shopId = req.userId
    const discountId = req.params.discountId
    const body = req.body

    const updatedDiscount = await DiscountService.updateDiscount({ shopId, discountId, body })

    if (!updatedDiscount) throw new BadRequestErrorResponse('Update discount failed')

    new OKSuccessResponse({ message: 'Update discount success', data: { updatedDiscount } }).send(res)
}

const getAllDiscount = async (req, res) => {
    const shopId = req.userId

    const discounts = await DiscountService.getAllDiscount(shopId)

    if (!discounts) throw new BadRequestErrorResponse('Discounts not found')

    new OKSuccessResponse({ message: 'OK', data: { discounts } }).send(res)
}

const getListProductByDiscount = async (req, res) => {
    const discountId = req.params.discountId

    const products = await DiscountService.getListProductByDiscount(discountId)

    if (!products) throw new BadRequestErrorResponse('Products not found')

    new OKSuccessResponse({ message: 'OK', data: { products } }).send(res)
}

const getDiscountAmount = async (req, res) => {
    const shopId = req.userId
    const discountId = req.params.discountId
    const totalOrder = req.body.totalOrder

    const {
        discountAmount,
        totalPriceAfterDiscount
    } = await DiscountService.getDiscountAmount({ shopId, discountId, totalOrder })

    if (discountAmount < 0 || totalPriceAfterDiscount <= 0) throw new BadRequestErrorResponse('Error')

    new OKSuccessResponse({ message: 'OK', data: { discountAmount, totalPriceAfterDiscount } }).send(res)
}

const deletedDiscount = async (req, res) => {
    const shopId = req.userId
    const discountId = req.params.discountId

    const deletedDiscount = await DiscountService.deleteDiscount({ shopId, discountId })

    if (!deletedDiscount) throw new BadRequestErrorResponse('Delete discount failed')

    new OKSuccessResponse('Delete discount success').send(res)
}

const cancelDiscount = async (req, res) => {
    const userId = req.userId
    const shopId = req.body.shopId
    const discountId = req.params.discountId

    const updatedDiscount = await DiscountService.cancelDiscount({ userId, shopId, discountId })

    if (!updatedDiscount) throw new BadRequestErrorResponse('Cancel discount failed')

    new OKSuccessResponse('Cancel discount success').send(res)
}

module.exports = {
    createDiscount,
    updateDiscount,
    getAllDiscount,
    getListProductByDiscount,
    getDiscountAmount,
    deletedDiscount,
    cancelDiscount
}