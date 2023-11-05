const { selectPropertiesData, unselectPropertiesData } = require("../../utils/appUtils")
const { Product } = require("../product.model")

const findProducts = async ({ query, limit, skip }) => {
    return await Product.find(query)
        .populate('user', 'username email -_id')
        .limit(limit)
        .skip(skip)
        .sort({ create_at: -1 })
        .lean()
}

const getListSearchProduct = async (keySearch) => {
    const regexSearch = new RegExp(keySearch)

    const products = await Product.find({
        $text: { $search: regexSearch },
        is_published: true
    }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .lean()

    return products
}

const getAllProduct = async ({ limit, page, sort, filter, select }) => {
    const orderBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const skip = (page - 1) * limit

    const products = Product.find(filter)
        .limit(limit)
        .skip(skip)
        .select(selectPropertiesData(select))
        .sort(orderBy)
        .lean()

    return products
}

const getProductById = async ({ productId, unselect }) => {
    const product = await Product.findById(productId).select(unselectPropertiesData(unselect))

    return product
}

module.exports = {
    findProducts,
    getListSearchProduct,
    getAllProduct,
    getProductById
}