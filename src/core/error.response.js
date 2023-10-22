'use strict'

const HttpStatusCode = {
    OK: 200,
    BAD_REQUEST: 400,
    AUTHORIZATION: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
}

const HttpMessage = {
    OK: "OK",
    BAD_REQUEST: "Bad Request",
    AUTHORIZATION: "Authorization",
    FORBIDDEN: "Forbidden",
    NOT_FOUND: "Not Found",
    INTERNAL_SERVER: "Internal Server Error",
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class BadRequestErrorResponse extends ErrorResponse {
    constructor(message = HttpMessage.BAD_REQUEST, status = HttpStatusCode.BAD_REQUEST) {
        super(message, status)
    }
}

class ForbiddenErrorResponse extends ErrorResponse {
    constructor(message = HttpMessage.FORBIDDEN, status = HttpStatusCode.FORBIDDEN) {
        super(message, status)
    }
}

class AuthorizationErrorResponse extends ErrorResponse {
    constructor(message = HttpMessage.AUTHORIZATION, status = HttpStatusCode.AUTHORIZATION) {
        super(message, status)
    }
}

module.exports = {
    BadRequestErrorResponse,
    ForbiddenErrorResponse,
    AuthorizationErrorResponse
}