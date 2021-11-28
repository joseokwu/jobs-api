const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong. Please try again later',
  };
  //if (err instanceof CustomAPIError) {
  //return res.status(err.statusCode).json({ msg: err.message })
  //}
  if (err.code && err.code === 11000) {
    (customError.status = StatusCodes.BAD_REQUEST),
      (customError.msg = `Duplicate ${Object.keys(err.keyValue)} values`);
  }
  if (err.name === 'CastError') {
    customError.status = StatusCodes.NOT_FOUND;
    customError.msg = `No job associated with id: ${err.value}`;
  }
  return res.status(customError.status).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
