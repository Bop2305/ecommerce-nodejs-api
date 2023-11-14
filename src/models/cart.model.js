const { default: mongoose } = require("mongoose");

const cartSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cart_state: { type: String, require: true, enum: ['ACTIVE', 'COMPLETED', 'FAILED', 'PENDING'] },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'modified_at' },
})

const Cart = mongoose.model('Cart', cartSchema)

module.exports = {
    Cart
}