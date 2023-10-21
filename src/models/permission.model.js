const { default: mongoose } = require("mongoose");

const permissionSchema = new mongoose.Schema({
    name: { type: String, require: true, unique: true },
    description: { type: String },
    create_at: { type: Date, default: Date.now },
})

const Permission = mongoose.model('Permission', permissionSchema)

module.exports = Permission