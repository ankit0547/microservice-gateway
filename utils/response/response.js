module.exports = {
  /** return error response function */
  errorResponse(res, status, message) {
    return res
      .status(status)
      .send({ code: status, status: "Failure", message: message });
  },

  /** return success response function */
  succesResponse(res, status, data) {
    return res
      .status(status)
      .send({ code: status, status: "Success", data: data });
  },
};
