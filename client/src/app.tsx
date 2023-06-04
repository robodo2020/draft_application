import React, { Component } from "react";
import { ExistedDraft } from "./ExistedDraft"; //error for e
import { NewDraft } from "./NewDraft";
import { Draft } from "./draft";
import { PickPage } from "./PickPage";

type Page = "main" | { kind: "pick"; draft: Draft };

interface AppState {
  page: Page;
  curDrafterName: string;
}

export class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);

    this.state = { page: "main", curDrafterName: "" };
  }

  render = (): JSX.Element => {
    if (this.state.page === "main") {
      return (
        <div>
          {/* <ExistedDraft onPick={this.handlePick}></ExistedDraft> */}
          <ExistedDraft
            onPick={this.handlePick}
            onDrafterNameChange={this.handleDrafterNameChange}
          ></ExistedDraft>
          <NewDraft
            onPick={this.handlePick}
            onDrafterNameChange={this.handleDrafterNameChange}
          ></NewDraft>
        </div>
      );
    } else {
      return (
        <PickPage
          initialDraft={this.state.page.draft}
          curDrafterName={this.state.curDrafterName}
        ></PickPage>
      );
    }
  };

  handlePick = (draft: Draft): void => {
    this.setState({ page: { kind: "pick", draft: draft } });

    console.log("----------- draft -----------");
    console.log(draft);
    console.log("----------- draft -----------");
  };
  handleDrafterNameChange = (curDrafterName: string): void => {
    this.setState({ curDrafterName: curDrafterName });
  };
}
