import { IDecorator, Kernel, Meta, olyCoreKeys } from "oly";
import { IRetryOptions } from "../interfaces";
import { Retry } from "../Retry";

export class RetryDecorator implements IDecorator {
  public constructor(private options: IRetryOptions) {
  }

  public asMethod(target: any, propertyKey: string, i: TypedPropertyDescriptor<any>): void {
    const action = i.value;
    const self = this;

    Meta
      .of({key: olyCoreKeys.injections, target, propertyKey: "__kernel__"})
      .set({type: Kernel});

    i.value = function oly$retry(this: any) {
      const args = arguments;
      const kernel = this.__kernel__;
      const r = kernel.inject(Retry);
      return r.operation(() => action.apply(this, args), self.options);
    };
  }
}

/**
 *
 */
export const retry = Meta.decoratorWithOptions<IRetryOptions>(RetryDecorator);
