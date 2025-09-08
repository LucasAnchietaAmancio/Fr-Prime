// utils/Response.js
class Response {
  static success(res, message, data = {}, status = 200) {
    return res.status(status).json({ success: true, message, data });
  }

  static create(res, message, status = 201) {
    return res.status(status).json({ success: true, message });
  }

  static error(res, message, errorCode = 'ERROR', status = 500) {
    return res.status(status).json({ success: false, message, errorCode });
  }
}

module.exports = Response;
