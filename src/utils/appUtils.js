const _ = require('lodash');

const pickProperties = (obj, propertiesToPick) => {
    if (!obj || !propertiesToPick || !Array.isArray(propertiesToPick)) {
        return {};
    }

    return _.pick(obj, propertiesToPick)
}

const selectPropertiesData = (properties) => {
    return Object.fromEntries(properties.map(property => [property, 1]))
}

const unselectPropertiesData = (properties) => {
    return Object.fromEntries(properties.map(property => [property, 0]))
}

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] == null || obj[key] == undefined) delete obj[key]
    })

    return obj
}

const updateNestObjectParser = (obj) => {
    const result = {}

    removeUndefinedObject(obj)

    Object.keys(obj).forEach(key => {
        if(typeof obj[key] == 'object' && !Array.isArray(obj[key])) {
            const res = updateNestObjectParser(obj[key])

            Object.keys(res).forEach(subkey => {
                result[`${key}.${subkey}`] = res[subkey]
            })
        } else {
            result[key] = obj[key]
        }
    })

    return result
}

module.exports = {
    pickProperties,
    selectPropertiesData,
    unselectPropertiesData,
    removeUndefinedObject,
    updateNestObjectParser
}