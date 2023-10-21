const { default: mongoose } = require("mongoose");

const roleSchema = new mongoose.Schema({
    name: { type: String, require: true, unique: true },
    description: { type: String },
    permission: [{ type: mongoose.Schema.ObjectId, ref: 'Permission' }],
    create_at: { type: Date, default: Date.now },
})

const Role = mongoose.model('Role', roleSchema)

module.exports = Role