class CustomErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.message = msg;
  }

  static alreadyExist(message) {
    return new CustomErrorHandler(200, message);
  }

  static wrongCredentials(message = "Username or password is wrong!") {
    return new CustomErrorHandler(200, message);
  }

  static unAuthorized(message = "unAuthorized") {
    return new CustomErrorHandler(200, message);
  }
  static userNotFound(message = "User Not Found") {
    return new CustomErrorHandler(200, message);
  }
  static productNotFound(message = "Id not found") {
    return new CustomErrorHandler(200, message);
  }
  static paymentFound(message = "Payment already exists.") {
    return new CustomErrorHandler(200, message);
  }

  static serverError(message = "Internal server error") {
    return new CustomErrorHandler(500, message);
  }
}

export default CustomErrorHandler;
