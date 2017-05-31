import { injectable } from "../kernel/decorators/injectable";
import { Kernel } from "../kernel/Kernel";
import { Logger } from "./Logger";
import { LogLevels } from "./LogLevels";

/**
 * Display {json: message} instead of classic format.
 *
 * ```typescript
 * kernel.with(JsonLogger);
 * ```
 */
@injectable({
  provide: Logger,
  singleton: false,
  use: (kernel: Kernel, parent: Function) => {
    return new JsonLogger(kernel.id).as(parent ? parent.name : "");
  },
})
export class JsonLogger extends Logger {

  public error(message: any, data?: object) {
    if (LogLevels[this.logLevel] <= LogLevels.ERROR) {
      this.appender(this.format("ERROR", message, data));
    }
  }

  protected format(type: string, message: string, data?: object) {
    return `{"date":"${new Date().toISOString()}","lvl":"${type}","app": "${this.appName}", `
      + `"ctx":"${this.contextId}","dep":"${this.componentName}", "msg":"${message}"`
      + (!!data ? `,"ext":${JSON.stringify(data)}}` : "}");
  }
}
