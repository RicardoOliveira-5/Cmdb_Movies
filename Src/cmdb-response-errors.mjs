
function HttpErrorResponse(status, body) {
    this.status = status
    this.body = body
}

const HTTP_STATUS_CODES = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
}

export default function(e) {
    switch(e.code) {
        case 0: return new HttpErrorResponse(HTTP_STATUS_CODES.UNAUTHORIZED, e.message)
        case 1: return new HttpErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, e.message)
        case 2: return new HttpErrorResponse(HTTP_STATUS_CODES.UNAUTHORIZED, e.message)
        case 3: return new HttpErrorResponse(HTTP_STATUS_CODES.NOT_FOUND, e.message)
        case 4: return new HttpErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, e.message)
        case 5: return new HttpErrorResponse(HTTP_STATUS_CODES.NOT_FOUND, e.message)
        case 6: return new HttpErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, e.message)
        case 7: return new HttpErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, e.message)
        default: return new HttpErrorResponse(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, ":( We are sorry but an internal error occurred.")
    }
}

