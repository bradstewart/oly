import { Kernel } from "oly";
import { JsonMapper } from "../src/services/JsonMapper";
import { Address, Person, Status } from "./fixtures";

describe("JsonMapper", () => {

  const kernel = Kernel.create();
  const mapper = kernel.inject(JsonMapper);
  const now = new Date();
  const data = JSON.stringify({
    addresses: [{
      details: ["a", "b"],
      street: "azerty",
    }],
    birthdate: now.toISOString(),
    name: "Jean",
    size: 30,
    status: Status.ENABLED,
    verified: true,
  });

  it("should map", () => {
    const person = mapper.mapClass(Person, JSON.parse(data));
    expect(person.name).toBe("Jean");
    expect(person.birthdate instanceof Date).toBeTruthy();
    expect(person.birthdate.toLocaleDateString()).toBe(now.toLocaleDateString());
    expect(person.status).toBe(Status.ENABLED);
    expect(person.addresses[0] instanceof Address).toBeTruthy();
    expect(person.addresses[0].details[1]).toBe("b");
  });

  it("should reverse map", () => {
    const person = mapper.mapClass(Person, JSON.parse(data));
    expect(JSON.parse(JSON.stringify(person))).toEqual(JSON.parse(data));
  });
});
