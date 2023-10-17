'use strict';

const app = require("./app");

const PORT = 3000;

const server = app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
})

process.on('SIGINT', () => {
    server.close(() => console.log('Exit Server Express'))
})