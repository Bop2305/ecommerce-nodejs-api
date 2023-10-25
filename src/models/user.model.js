const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, require: true },
    email: { type: String, require: true, unique: true, },
    password: { type: String, require: true },
    create_at: { type: Date, default: Date.now },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
})

const User = mongoose.model('User', userSchema)

module.exports = User