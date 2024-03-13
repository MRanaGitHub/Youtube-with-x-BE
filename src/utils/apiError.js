class ApiError extends Error {
  constructor(
    staatusCode,
    message = "Something went wrong",
    errors = [],
    stactck = ""
  ) {
    super(message);
    this.staatusCode = staatusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stactck) {
      this.stack = stactck;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
