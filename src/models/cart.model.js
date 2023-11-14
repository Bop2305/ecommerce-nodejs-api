const { default: mongoose } = require("mongoose");

const cartSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cart_state: { type: String, require: true, enum: ['ACTIVE', 'COMPLETED', 'FAILED', 'PENDING'] },
}, {
    timeseries: {
        createAt: 'create_at',
        updateAt: 'modified_at'
    }
})

const Cart = mongoose.model('Cart', cartSchema)

module.exports = {
    Cart
}