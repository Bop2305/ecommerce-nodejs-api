const _ = require('lodash');

const pickProperties = (obj, propertiesToPick) => {
    if (!obj || !propertiesToPick || !Array.isArray(propertiesToPick)) {
        return {};
    }

    return _.pick(obj, propertiesToPick)
}

module.exports = {
    pickProperties
}