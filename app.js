const express = require('express')
const morgan = require('morgan')
const routes = require('./src/routes')
const app = express()
const {default: helmet} = require('helmet')
require('dotenv').config()

const { checkOverload } = require('./src/helpers/check.connect')
const compression = require('compression')

// init middwares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// init db
require('./src/dbs/init.mongodb')
checkOverload()

// init router
app.use(routes)

module.exports = app
