const { default: mongoose } = require("mongoose");

const addressSchema = new mongoose.Schema({
    street_name: { type: String, require: true },
    state_name: { type: String, require: true },
    district_name: { type: String, require: true },
    city_name: { type: String, require: true },
    country_name: { type: String, require: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const Address = mongoose.model('Address', addressSchema)

module.exports = {
    Address
}