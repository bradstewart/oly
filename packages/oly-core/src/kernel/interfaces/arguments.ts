import { IMetadata } from "../../decorator/interfaces";
import { Kernel } from "../Kernel";

export interface IArgumentArg {
  type: any;
  handler: (kernel: Kernel) => any;
}

export interface IArgumentsMetadata extends IMetadata {
  args: {
    [key: string]: IArgumentArg[];
  };
}
