'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')

// count connect
const countConnect = () => {
    const numConnection = mongoose.connections.length
    // console.log(`Number of connections::${numConnection }`)
    return numConnection
}

// check overload

const checkOverload = () => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    // Maximum number of connections based on number of cores
    const maxConnections = numCores * 5

    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
        console.log(`Connection overload detected`)
    }
}

module.exports = {
    countConnect,
    checkOverload
}