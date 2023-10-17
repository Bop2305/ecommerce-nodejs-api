const express = require('express')
const morgan = require('morgan')
const {default: helmet} = require('helmet')
const compression = require('compression')
const app = express()

// init middwares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// init db

// init router
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: "Hi"
    })
})

module.exports = app
