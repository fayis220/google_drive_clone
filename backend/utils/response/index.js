const responseStatus = require("./responseStatus");
const responseCode = require("./responseCode");

module.exports = {
  success: (data = {}) => ({
    status: responseStatus.success,
    code: responseCode.success,
    message: data.message || "Your request is successfully executed",
    data: data.data || null,
  }),

  failure: (data = {}) => ({
    status: responseStatus.failure,
    code: responseCode.internalServerError,
    message: data.message || "Some error occurred while performing action.",
    data: data.data || null,
  }),

  internalServerError: (data = {}) => ({
    status: responseStatus.serverError,
    code: responseCode.internalServerError,
    message: data.message || "Internal server error.",
    data: data.data || null,
  }),

  badRequest: (data = {}) => ({
    status: responseStatus.badRequest,
    code: responseCode.badRequest,
    message: data.message || "Request parameters are invalid or missing.",
    data: data.data || null,
  }),

  recordNotFound: (data = {}) => ({
    status: responseStatus.recordNotFound,
    code: responseCode.notFound,
    message: data.message || "Record(s) not found with specified criteria.",
    data: data.data,
  }),

  validationError: (data = {}) => ({
    status: responseStatus.validationError,
    code: responseCode.validationError,
    message: data.message || "Invalid Data, Validation Failed.",
    data: data.data || null,
  }),

  unAuthorized: (data = {}) => ({
    status: responseStatus.unAuthorized,
    code: responseCode.unAuthorized,
    message: data.message || "You are not authorized to access the request",
    data: data.data || null,
  }),

  serverError: (data = {}) => ({ data: data.data }),
  notFound: (data = {}) => ({ data: data.data }),
};
