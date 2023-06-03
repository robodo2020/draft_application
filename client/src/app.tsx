import React, { Component } from "react";
import { ExistedDraft } from "./ExistedDraft"; //error for e
import { NewDraft } from "./NewDraft";

type Page = "main" | "pick";

interface AppState {
  page: Page;
  curDrafter: string;
}

export class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);

    this.state = { page: "main", curDrafter: "" };
  }

  render = (): JSX.Element => {
    if (this.state.page === "main") {
      return (
        <div>
          <ExistedDraft onPick={this.handlePick}></ExistedDraft>
          <NewDraft onPick={this.handlePick}></NewDraft>
        </div>
      );
    } else {
      return <p>working on...</p>;
    }
  };

  handlePick = (): void => {
    this.setState({ page: "pick" });
  };
}
