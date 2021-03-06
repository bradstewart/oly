import { inject } from "oly";
import { Router } from "oly-react";
import * as React from "react";
import { Component } from "react";
import { Docs } from "../services/Docs";

export class Mark extends Component<{ html: string; className?: string }, {}> {
  @inject docs: Docs;
  @inject router: Router;

  get html() {
    let html = this.props.html;

    html = html.replace(
      /href="(http.+?)"/g,
      "target=\"_blank\" href=\"$1\"");

    html = html.replace(
      /([A-Za-z]+#[A-Za-z]+?)\(.*?\)/g,
      (element, query) => {
        const [d] = this.docs.search(query);
        if (d && !this.router.isActive(d.href, true)) {
          return `<a href="${d.href}" class="link" style="color: inherit">${element}</a>`;
        }
        return element;
      },
    );

    html = html.replace(
      /(@[a-z]+)/g,
      (element, query) => {
        const [d] = this.docs.search(query);
        if (d && !this.router.isActive(d.href, true)) {
          return `<a href="${d.href}" class="link">${element}</a>`;
        }
        return element;
      },
    );

    const services = this.docs.services;
    for (const s of services) {
      html = html.replace(
        new RegExp(`[^\\w](${s.name})[^\\w/#]`, "g"),
        (element, query) => {
          const results = this.docs.search(query);
          const d = results.filter((r) => r.name === query)[0];
          if (d && !this.router.isActive(d.href, true)) {
            return element.replace(query, `<a href="${d.href}" class="link" style="color: inherit">${query}</a>`);
          }
          return element;
        },
      );
    }

    for (const m of this.docs.modules) {
      html = html.replace(
        new RegExp(`["\s](${m.name})["\s.,]`, "g"),
        (element, query) => {
          const href = this.router.href({
            to: "moduleById",
            params: {
              module: query,
            },
          });
          if (href && !this.router.isActive(href)) {
            return element.replace(query, `<a href="${href}" class="link" style="color: inherit">${query}</a>`);
          }
          return element;
        },
      );
    }

    return html;
  }

  public render() {
    if (!this.props.html) {
      return (
        <div className="pt-callout pt-icon-info-sign">
          <p>Documentation is missing</p>
          <small>It seems like there is no description about this thing yet. Come back later!</small>
        </div>
      );
    }
    return (
      <div
        className={"content prism " + this.props.className}
        dangerouslySetInnerHTML={{__html: this.html}}
      />
    );
  }
}
