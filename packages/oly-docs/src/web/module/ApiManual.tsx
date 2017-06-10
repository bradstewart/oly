import { attach } from "oly-react";
import * as React from "react";
import { Component } from "react";
import { IDocManual } from "../../cli";
import { IModuleContent } from "../../cli/interfaces";
import { Prism } from "../layout/Prism";

@attach
export class ApiManual extends Component<{ module: IModuleContent; manual: IDocManual }, {}> {

  public render() {
    return (
      <div>
        <h2>{this.props.manual.name}</h2>
        <br/>
        <Prism html={this.props.manual.content}/>
      </div>
    );
  }
}