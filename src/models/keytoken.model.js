const { default: mongoose } = require("mongoose");

const keyTokenSchema = new mongoose.Schema({
    refresh_token: { type: Array, require: true, default: [] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    create_at: { type: Date, default: Date.now },
})

const KeyToken = mongoose.model('KeyToken', keyTokenSchema)

module.exports = KeyToken