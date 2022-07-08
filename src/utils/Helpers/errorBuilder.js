export default class ErrorBuilder {
  statusCode = 500;
  message = "Something has gone wrong";

  status(num) {
    this.statusCode = num;
    return this;
  }

  msg(str) {
    this.message = str;
    return this;
  }
}
