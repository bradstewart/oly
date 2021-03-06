import { IDecorator, Meta } from "oly";
import { olyCronKeys } from "../constants/keys";

export class CronDecorator implements IDecorator {

  public constructor(private options: string) {
  }

  public asMethod(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void {
    Meta.of({key: olyCronKeys.schedulers, target, propertyKey}).set({
      cron: this.options,
    });
  }
}

export const cron = Meta.decoratorWithOptions<string>(CronDecorator);
