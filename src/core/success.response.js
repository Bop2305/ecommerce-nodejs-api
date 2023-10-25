'use strict'

const HttpStatusCode = {
    OK: 200,
    CREATED: 201,
}

const HttpMessage = {
    OK: "OK",
    CREATED: "Created",
}

class SuccessResponse {
    constructor({message = HttpMessage.OK, data = {}, status = HttpStatusCode.OK}) {
        this.message = message
        this.status = status
        this.data = data
    }

    send(res, header = {}) {
        return res.status(this.status).json(this)
    }
}

class OKSuccessResponse extends SuccessResponse {
    constructor({message, data}) {
        super({message, data})
    }
}

class CreatedSuccessResponse extends SuccessResponse {
    constructor({message, data, status = HttpStatusCode.CREATED}) {
        super({message, data, status})
    }
}

module.exports = {
    OKSuccessResponse,
    CreatedSuccessResponse
}