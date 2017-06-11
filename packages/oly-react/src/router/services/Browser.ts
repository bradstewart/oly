import { History } from "history";
import { _, inject, Logger } from "oly-core";
import * as React from "react";
import * as ReactDOM from "react-dom";

/**
 * It's a safe browser to avoid the use of global variables in universal env.
 *
 * ```ts
 * browser.exists()
 * ```
 *
 * There is also a ref to the last mount app.
 *
 * ```ts
 * browser.root // React App
 * ```
 */
export class Browser {

  public history: History;

  @inject
  protected logger: Logger;

  protected container: HTMLElement | null;

  /**
   * Ref to window.
   */
  public get window(): Window {
    if (!this.exists()) {
      throw new Error("There is no DOM env here");
    }
    return window;
  }

  /**
   * Ref to window.document.
   */
  public get document(): Document {
    return this.window.document;
  }

  /**
   * Safe div container.
   */
  public get root(): HTMLElement {
    if (!this.container) {
      throw new Error("There is no container yet, maybe you should call #render() before");
    }
    return this.container;
  }

  /**
   * Check if browser window is available.
   */
  public exists(): boolean {
    return _.isBrowser();
  }

  /**
   * Exec ReactDOM.render and ensure that the mountId exists.
   *
   * @param element
   * @param mountId
   */
  public render(element: React.ReactElement<any>, mountId: string): void {

    this.container = this.window.document.getElementById(mountId);
    if (!this.container) {
      this.logger.warn(`No element with id="${mountId}" was found. You can use REACT_ID for changing the mount id.`);
      this.container = document.createElement("div");
      this.container.setAttribute("id", mountId);
      document.body.appendChild(this.container);
    }

    ReactDOM.render(element, this.container);
  }
}
