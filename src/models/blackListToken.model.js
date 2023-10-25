const { default: mongoose } = require("mongoose");

const blackListTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tokens: {
        type: Array,
        require: true,
        default: []
    },
    create_at: { 
        type: Date,
        default: Date.now
    },

})

const BlackListToken = mongoose.model('BlackListToken', blackListTokenSchema)

module.exports = BlackListToken