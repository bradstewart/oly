import { Go } from "oly-react";
import * as React from "react";
import { Component } from "react";
import { IModuleContent } from "../../shared/interfaces";
import { Mark } from "../shared/Mark";

export interface IConfigurationProps {
  module: IModuleContent;
}

export interface IConfigurationState {
}

export class Configuration extends Component<IConfigurationProps, IConfigurationState> {

  public render(): JSX.Element {
    return (
      <table className="table links" style={{width: "100%"}}>
        <thead>
        <tr>
          <th>Name</th>
          <th>Provider</th>
          <th>Description</th>
        </tr>
        </thead>
        <tbody>
        {this.props.module.env.map((env) => (
          <tr key={env.name}>
            <td><strong>{env.name}</strong></td>
            <td>
              <Go to="service" params={{service: env.target}}>
                {env.target}
              </Go>
            </td>
            <td>
              <p>
                <code>{env.type}</code>
                {" = "}
                <em>{env.default}</em>
              </p>
              <Mark html={env.description}/>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    );
  }
}