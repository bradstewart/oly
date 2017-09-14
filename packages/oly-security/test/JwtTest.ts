import { Kernel, Time } from "oly";
import { JwtAuth } from "../src/services/JwtAuth";
import { Jwt } from "../src/utils/Jwt";

describe("Jwt", () => {

  const kernel = Kernel.create({SECURITY_TOKEN_EXPIRATION: 1});
  const time: Time = kernel.get(Time);
  const jwtAuth = kernel.get(JwtAuth);

  time.global();

  beforeEach(() => time.reset());

  it("should check token validity", () => {
    const tk = jwtAuth.createToken({id: "1"});
    expect(Jwt.lifeTime(tk)).toBe(1);
    expect(Jwt.isValid("")).toBeFalsy();
    expect(Jwt.isValid("zpidjaiodioazhdiazhdioaz")).toBeFalsy();
    expect(Jwt.isValid(tk)).toBeTruthy();
    time.pause();
    expect(Jwt.isValid(tk)).toBeTruthy();
    time.travel(1000);
    expect(Jwt.isValid(tk)).toBeFalsy();
  });

  it("should check roles", () => {
    const tk = jwtAuth.createToken({id: "1", roles: ["ADMIN"]});
    const tk2 = jwtAuth.createToken({id: ":)"});
    time.pause();
    expect(Jwt.hasRole(tk, "ADMIN")).toBeTruthy();
    expect(Jwt.hasRole(tk, "USER")).toBeFalsy();
    expect(Jwt.hasRole(tk2, "ADMIN")).toBeFalsy();
    expect(Jwt.hasRole("", "ADMIN")).toBeFalsy();
    expect(Jwt.hasRole("zpidjaiodioazhdiazhdioaz", "ADMIN")).toBeFalsy();
    time.travel(1000);
    expect(Jwt.hasRole(tk, "ADMIN")).toBeFalsy();
  });
});
