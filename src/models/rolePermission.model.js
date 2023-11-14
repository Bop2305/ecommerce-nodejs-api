const { default: mongoose } = require("mongoose");

const rolePermissionSchema = new mongoose.Schema({
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    permission: { type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }
}, {
    timeseries: {
        createAt: 'create_at',
        updateAt: 'modified_at'
    }
})

const RolePermission = mongoose.model('RolePermission', rolePermissionSchema)

module.exports = {
    RolePermission
}