import { inject, state } from "oly-core";
import { attach, Router } from "oly-react";
import * as React from "react";
import { Component } from "react";
import { IDocs } from "../../cli/interfaces";
import { ModuleService } from "../ModuleService";

@attach
export class Prism extends Component<{ html: string }, {}> {

  @state("DOCS") docs: IDocs;
  @inject ms: ModuleService;
  @inject router: Router;

  public get html() {
    let html = this.props.html;

    html = html.replace(
      /href="(http.+?)"/g,
      "target=\"_blank\" href=\"$1\"");

    html = html.replace(
      /([A-Za-z]+#[A-Za-z]+?)\(.*?\)/g,
      (element, query) => {
        const [d] = this.ms.search(query);
        if (d && !this.router.isActive(d.href, true)) {
          return `<a href="${d.href}" class="link" >${element}</a>`;
        }
        return element;
      },
    );

    html = html.replace(
      /(@[a-z]+)/g,
      (element, query) => {
        const [d] = this.ms.search(query);
        if (d && !this.router.isActive(d.href, true)) {
          return `<a href="${d.href}" class="link">${element}</a>`;
        }
        return element;
      },
    );

    const services = this.ms.getServices();
    for (const s of services) {
      html = html.replace(
        new RegExp(`(${s.name})[^\\w/#]`, "g"),
        (element, query) => {
          const results = this.ms.search(query);
          const d = results.find((r) => r.name === query);
          if (d && !this.router.isActive(d.href, true)) {
            return element.replace(query, `<a href="${d.href}" class="link">${query}</a>`);
          }
          return element;
        },
      );
    }

    for (const m of this.docs.modules) {
      html = html.replace(
        new RegExp(`(${m.name})`, "g"),
        (element, query) => {
          const href = this.router.href({
            to: "module",
            params: {
              module: query,
            },
          });
          if (href) {
            return element.replace(query, `<a href="${href}" class="link" style="color: black">${query}</a>`);
          }
          return element;
        },
      );
    }

    return html;
  }

  public render() {
    return (
      <div dangerouslySetInnerHTML={{__html: this.html}}/>
    );
  }
}
