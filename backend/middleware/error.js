// const { stack } = require("../app");
const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "interval server error"
    //worge mongodb id error 

    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid:${err.path}`
        err = new ErrorHandler(message, 400)
    }
    //mongoose duplicate key erro
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keysValue)} Entered`
        err = new ErrorHandler(message, 400);
    }
    //wrong JWT error;
    if (err.name === 'jsonWebTokentError') {
        const message = `Json web token is invailid ,try again`;
        err = new ErrorHandler(message, 400);
    }
    //JWT Expired error

    if (err.name === 'TokenExpiredError') {
        const message = `Json web token is invailid ,try again`;
        err = new ErrorHandler(message, 400);
    }



    res.status(err.statusCode).json({
        sucess: false,
        message: err.message,
        // message:err
    });
}