class ExpressError extends Error{
    constructor(messgae, statusCode){
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpresError;