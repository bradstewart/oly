import { attach } from "oly-react";
import * as React from "react";
import { CSSProperties } from "react";

@attach
export class Footer extends React.Component<{}, {}> {

  private styles: CSSProperties = {
    fontSize: "10px",
    padding: "10px",
    textAlign: "center",
  };

  public render() {
    return (
      <div style={this.styles}>
        ~ Generated by something the {new Date().toDateString()}. ~
      </div>
    );
  }
}
