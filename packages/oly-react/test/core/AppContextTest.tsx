/**
 * @jest-environment jsdom
 */

import { _, env, inject, Kernel, on, state } from "oly-core";
import { createKernel } from "oly-test";
import * as React from "react";
import { Component } from "react";
import { render } from "react-dom";
import { AppContext } from "../../src/core/components/AppContext";
import { ACTIONS_ERROR, ACTIONS_SUCCESS } from "../../src/core/constants";
import { action } from "../../src/core/decorators/action";
import { attach, connect } from "../../src/core/decorators/attach";
import { styles } from "../../src/core/decorators/styles";
import { IActionResult, IActionResultError } from "../../src/core/interfaces";

class PersonService {
  createPerson() {
    return {name: "Luc"};
  }
}

@connect
class A extends Component<any, any> {
  @inject(Kernel) kernel: Kernel;

  @on("plus")
  inc() {
    const counter = this.kernel.state("counter") || 0;
    this.kernel.state("counter", counter + 1);
  }

  render() {
    return (<div id="A">A</div>);
  }
}

@attach
@styles(() => null)
class B extends Component<any, any> {

  @env("DEFAULT_NAME") defaultName: string;

  @inject kernel: Kernel;

  @inject personService: PersonService;

  @state("person") person: { name: string };

  @state("open") open: boolean;

  @on("rename") renameHandler = (name: string) => this.person = {name};

  @action
  renameAction() {
    return this.person = this.personService.createPerson();
  }

  @action
  async renameActionAsync() {
    await _.timeout(1);
    return this.person = this.personService.createPerson();
  }

  @action
  renameActionLikeACow() {
    throw new Error("I am Groot");
  }

  componentWillMount() {
    this.person = {name: this.defaultName};
  }

  render() {
    return (
      <div>
        <button id="btn1" onClick={this.renameAction}>rename</button>
        <button id="btn2" onClick={this.renameActionLikeACow}>rename</button>
        <button id="btn3" onClick={this.renameActionAsync}>rename</button>
        <strong>
          {this.person.name}
        </strong>
        {this.open && <A/>}
      </div>
    );
  }
}

const kernel = createKernel({DEFAULT_NAME: "Francis"});
const container = document.createElement("div");
container.setAttribute("id", "app");
document.body.appendChild(container);
const dom = {
  container,
  get: (query: string): HTMLElement => {
    const el = container.querySelector(query);
    if (!el) {
      throw new Error(`Element not found (query='${query}')`);
    }
    return el as HTMLElement;
  },
};

describe("AppContext", () => {

  beforeAll(() => {
    render(<AppContext kernel={kernel}><B/></AppContext>, dom.container);
  });

  it("empty AppContext", () => {
    expect(dom.get("strong").textContent).toBe("Francis");
  });

  it("componentWillMount can initialize state", () => {
    expect(dom.get("strong").textContent).toBe("Francis");
  });

  it("state mutation update component", async () => {
    kernel.state("person", {name: "Paul"});
    await _.timeout(1);
    expect(dom.get("strong").textContent).toBe("Paul");
  });

  it("action autobind", async () => {
    setTimeout(() => {
      dom.get("#btn1").click();
    });
    const result: IActionResult<{ name: string }> = await kernel.on(ACTIONS_SUCCESS, _.noop).wait();
    expect(dom.get("strong").textContent).toBe("Luc");
    expect(result.data.name).toEqual("Luc");
  });

  it("kernel emission", async () => {
    await kernel.emit("rename", "Jack");
    expect(dom.get("strong").textContent).toBe("Jack");
  });

  it("kernel __free__", async () => {
    kernel.state("counter", 0);
    kernel.state("open", true);
    await _.timeout(1);
    await kernel.emit("plus");
    expect(dom.container.querySelector("#A")).not.toBe(null);
    expect(kernel.state("counter")).toBe(1);
    kernel.state("open", false);
    await _.timeout(1);
    expect(dom.container.querySelector("#A")).toBe(null);

    // Emitting "plus" here has not effect, no more component are subscribed to this event.
    await kernel.emit("plus");
    expect(kernel.state("counter")).toBe(1);
  });

  it("catch action error", async () => {
    setTimeout(() => {
      dom.get("#btn2").click();
    }, 10);
    const result: IActionResultError = await kernel.on(ACTIONS_ERROR, _.noop).wait();
    expect(result.error.message).toBe("I am Groot");
  });

  it("action async", async () => {
    setTimeout(() => {
      dom.get("#btn3").click();
    }, 10);
    const result: IActionResult<{ name: string }> = await kernel.on(ACTIONS_SUCCESS, _.noop).wait();
    expect(dom.get("strong").textContent).toBe("Luc");
    expect(result.data.name).toEqual("Luc");
  });
});
