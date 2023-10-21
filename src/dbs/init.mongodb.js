'use strict'

require('dotenv').config();
const mongoose = require('mongoose');

const host = process.env.DEV_DB_HOST
const port = process.env.DEV_DB_PORT
const name = process.env.DEV_DB_NAME

const connectString = `mongodb://${host}:${port}/${name}`
const { countConnect } = require('../helpers/check.connect')

class Database {
    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }

        mongoose
            .connect(connectString)
            .then(() => console.log(`Connect MongoDb Success::${countConnect()}`))
            .catch(err => console.log(`Error connecting to MongoDB:`, err))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb

