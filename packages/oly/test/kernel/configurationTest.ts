import { equal } from "assert";
import { USE_PROCESS_ENV } from "../../src/kernel/configuration";
import { Kernel } from "../../src/kernel/Kernel";

describe("USE_PROCESS_ENV()", () => {
  it("should use global process.env", () => {

    process.env.LOGGER_LEVEL = "ERROR";
    process.env.HELLO = "ERROR";

    const kernel = Kernel
      .create({HELLO: "WORLD", LOGGER_LEVEL: "DEBUG"})
      .configure(USE_PROCESS_ENV);

    equal(kernel.env("LOGGER_LEVEL"), "ERROR");
    equal(kernel.env("HELLO"), "ERROR");
  });
});
