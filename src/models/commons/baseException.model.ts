class BaseException {
  message: string;
  statusCode: number;
  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

export default BaseException;