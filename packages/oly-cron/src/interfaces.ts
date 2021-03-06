import { IMetadata } from "oly";

export interface IScheduler {
  cron: string;
}

export interface ISchedulersMetadata extends IMetadata {
  properties: {
    [key: string]: IScheduler;
  };
}
