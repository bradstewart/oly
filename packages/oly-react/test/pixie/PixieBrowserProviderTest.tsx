/**
 * @jest-environment jsdom
 */
import { Kernel } from "oly";
import { Pixie } from "../../src/pixie/services/Pixie";
import { page } from "../../src/router/decorators/page";
import { ReactBrowserProvider } from "../../src/router/providers/ReactBrowserProvider";

describe("PixieBrowserProvider", () => {

  window["__pixie__"] = {// tslint:disable-line
    a: "b",
  };

  class FakeApp {
    @page
    home() {
      return "";
    }
  }

  const kernel = Kernel.create()
    .with(FakeApp, ReactBrowserProvider);

  const pixie = kernel.inject(Pixie);

  it("should", () => {
    expect(pixie.get("a")).toBe("b");
  });
});