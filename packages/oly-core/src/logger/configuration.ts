import { Kernel } from "../Kernel";
import { JsonLogger } from "./JsonLogger";
import { MutedLogger } from "./MutedLogger";

/**
 * Hide Logger if production mode is enabled.
 *
 * @param kernel
 */
export const USE_MUTED_LOGGER_ON_PRODUCTION = (kernel: Kernel) => {
  if (kernel.isProduction()) {
    kernel.with(MutedLogger);
  }
};

/**
 * Use JsonLogger if production mode is enabled.
 *
 * @param kernel
 */
export const USE_JSON_LOGGER_ON_PRODUCTION = (kernel: Kernel) => {
  if (kernel.isProduction()) {
    kernel.with(JsonLogger);
  }
};
