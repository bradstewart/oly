import { olyCoreErrors } from "../kernel/constants/errors";

/**
 * It's an enhancement of Error with toJSON, cause, ...
 * It's totally BROKEN in es5. sorry.
 *
 * Exception has a real #toJSON(). It can be stringify.
 * ```typescript
 * console.log(JSON.stringify(new Exception("A")));
 * ```
 *
 * Exception can have a cause (reason).
 * ```typescript
 * try {
 *   try {
 *     throw new Error("A");
 *   } catch (e) {
 *    throw new Exception(e, "B");
 *   }
 * } catch (e) {
 *  throw new Exception(e, "C");
 * }
 * ```
 *
 * You can set a default message.
 * ```typescript
 * class MyException extends Exception {
 *    message = "My default message";
 * }
 * ```
 *
 * This is designed to be overridden.
 * ```typescript
 * class MyException extends Exception {
 * }
 * ```
 *
 * You can use `instanceof` without fear.
 */
export class Exception extends Error {

  /**
   * Error name.
   * It's not virtual, it's mutable.
   * By default, `name = constructor.name`.
   */
  public name: string;

  /**
   * Error cause.
   * Optional Error/Exception which has triggered this exception.
   * It's useful when you have long business logic.
   */
  public cause?: Throwable;

  /**
   * Our witness error.
   * It's useful because we have a virtual #stack and #message.
   */
  private source: Error;

  /**
   * Create a new exception.
   *
   * @param cause         Source (cause) or message
   * @param message       Optional message if not set as source
   */
  public constructor(cause?: string | Throwable, message?: string) {
    super();

    this.name = (this.constructor as any).name;
    // because we have a virtual message and a virtual stack
    this.source = new Error();
    this.source.message = (
        typeof cause === "string"
          ? cause
          : message)
      || olyCoreErrors.defaultException();

    if (typeof cause !== "string" && typeof cause !== "undefined") {
      this.cause = cause;
    }

    // if we have a default message, it will be overridden by children "default message"
    const isDefaultMessage = this.source.message === olyCoreErrors.defaultException();

    // getters/setters are broken on es6, we need to do this
    Object.defineProperty(this, "stack", {
      get: () => this.getStackTrace(),
    });
    Object.defineProperty(this, "message", {
      get: () => this.source.message,
      set: (m: string) => {
        if (isDefaultMessage) {
          this.source.message = m;
        }
      },
    });
  }

  /**
   * Get the long stack trace.
   */
  public getStackTrace(): string {

    let level = 0;
    let parent = this as any;
    while (parent && parent.__proto__ && parent.__proto__.constructor !== Exception) {
      if (level >= 100) {
        throw new TypeError("Infinite loop");
      }
      level++;
      parent = parent.__proto__;
    }

    let stack = this.source.stack || "";

    // remove constructor-lines, it's useless
    const array = stack.split("\n");
    array.splice(1, 1 + level);
    stack = array.join("\n").replace("Error:", this.name + ":");

    if (this.cause) {
      stack += `\n\nCaused by: ${this.cause.stack}`;
    }

    return stack;
  }

  /**
   * Override toString to add the cause.
   */
  public toString(): string {

    let message = `${this.name}: ${this.message}`;

    if (this.cause) {
      message += ". Caused by: " + this.cause;
    }

    return message;
  }

  /**
   * Return error as object without shitty data.
   * Designed to be overridden.
   *
   * ```typescript
   * class A extends Exception {
   *   toJSON() {
   *     return {
   *       ...super.toJSON(),
   *       a: "b",
   *     }
   *   }
   * }
   * ```
   */
  public toJSON(): object {

    const json: any = {
      message: this.message,
      name: this.name,
    };

    if (this.cause) {
      if (this.cause instanceof Exception) {
        json.cause = this.cause.toJSON();
      } else {
        json.cause = {
          message: this.cause.message,
          name: this.cause.name,
        };
      }
    }

    return json;
  }
}

/**
 * Exception or Error. no more.
 */
export type Throwable = Error | Exception;