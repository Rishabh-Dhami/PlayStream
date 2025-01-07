class ErrorHandler extends Error{
    constructor(statusCode, message, details = null){
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}


export {ErrorHandler};