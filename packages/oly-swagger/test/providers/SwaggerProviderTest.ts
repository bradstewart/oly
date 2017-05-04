import { ApiProvider, get, use } from "oly-api";
import { Kernel } from "oly-core";
import { HttpClient } from "oly-http";
import { SwaggerProvider } from "../../src/providers/SwaggerProvider";

describe("SwaggerProvider", () => {

  const toto = () =>
    function hasRoleMiddleware(ctx: any, next: any) {
      return next();
    };

  class Ctrl {
    @use(toto())
    @get("/") index() {
      return {ok: true};
    }
  }

  const kernel = new Kernel({
    OLY_HTTP_SERVER_PORT: 6833,
    OLY_LOGGER_LEVEL: "ERROR",
  }).with(Ctrl, SwaggerProvider);

  beforeAll(() => kernel.start());
  afterAll(() => kernel.stop());

  describe("#onStart()", () => {
    it("should provide spec", async () => {
      const server = kernel.get(ApiProvider);
      const client = kernel.get(HttpClient).with({baseURL: server.hostname});
      const {data} = await client.get<any>("/swagger.json");
      expect(data.swagger).toBe("2.0");
      expect(data.securityDefinitions.Bearer.in).toBe("header");
    });
    it("should provide ui", async () => {
      const server = kernel.get(ApiProvider);
      const client = kernel.get(HttpClient).with({baseURL: server.hostname});
      const {data} = await client.get<any>("/swagger/ui");
      expect(typeof data).toBe("string");
      expect(data.indexOf("html")).not.toBe(-1);
    });
  });
});
