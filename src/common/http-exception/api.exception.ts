import { HttpStatus, HttpException } from "@nestjs/common";

export class ApiException extends HttpException {
  private readonly errorMessage: string;
  private readonly statusCode: HttpStatus
  constructor(errorMessage: string, statusCode: HttpStatus) {
    super(errorMessage, statusCode);
    this.errorMessage = errorMessage;
    this.statusCode = statusCode;
  }

  getErrorCode(): HttpStatus {
    return this.statusCode;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }
}
