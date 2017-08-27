import { attach } from "oly-react";
import * as React from "react";
import { Component } from "react";
import { IDocComponent, IModuleContent } from "../../shared/interfaces";
import { Prism } from "../layout/Prism";

@attach
export class ApiComponent extends Component<{ module: IModuleContent; component: IDocComponent }, {}> {

  public render() {
    return (
      <div>
        <div className="Module_head">
          <small className="pt-text-muted">Component</small>
          <h2>{`<${this.props.component.name}/>`}</h2>
        </div>
        <div className="separator"/>
        <div className="Module_body">
          <Prism html={this.props.component.install} className="naked"/>
          <h3>Description</h3>
          <Prism html={this.props.component.description}/>
          <h3>Props</h3>
          <table className="pt-table pt-striped pt-bordered">
            <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
            </thead>
            <tbody>
            {this.props.component.props.concat().reverse().map((prop) => (
              <tr key={prop.name}>
                <td><strong>{prop.name}</strong></td>
                <td><code>{prop.type.replace("undefined | ", "")}</code></td>
                <td>{prop.optional ? "" : "true"}</td>
                <td><Prism html={prop.description} className="naked"/></td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}