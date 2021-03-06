import { HttpServerException } from "oly-http";
import { olyApiErrors } from "../constants/errors";

export class UnauthorizedException extends HttpServerException {

  public message: string = olyApiErrors.unauthorized();

  public status: number = 401;
}
