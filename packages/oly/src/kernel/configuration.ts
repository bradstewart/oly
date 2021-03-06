import { Kernel } from "./Kernel";

/**
 * Merge process.env into kernel store.
 * Warning, only declared fields will be rewritten.
 *
 * ```ts
 * new Kernel().configure(USE_PROCESS_ENV);
 * ```
 *
 * @param kernel
 */
export const USE_PROCESS_ENV = (kernel: Kernel) => {
  for (const key of Object.keys(process.env)) {
    if (typeof kernel.state(key) !== "undefined") {
      kernel.state(key, process.env[key]);
    }
  }
};

/**
 *
 * @param kernel
 */
export const USE_STOP_ON_EXIT = (kernel: Kernel) => {
  process.once("SIGINT", () => {
    kernel.stop()
      .then(() => process.exit())
      .catch(() => process.exit());
  });
};
