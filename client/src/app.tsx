import React, { Component } from "react";
import { ExistedDraft } from "./ExistedDraft";
import { NewDraft } from "./NewDraft";
import { Draft } from "./draft";
import { PickPage } from "./PickPage";

/** Page is the type for switching display page on browser*/
type Page = "main" | { kind: "pick"; draft: Draft };

/**
 * AppState is the state of the app
 * @param page the page to show on the webpage
 * @param curDrafterName the draft name that user input
 */
interface AppState {
  page: Page;
  curDrafterName: string;
}

/** The App component that is the main client-side component */
export class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);

    this.state = { page: "main", curDrafterName: "" };
  }

  render = (): JSX.Element => {
    if (this.state.page === "main") {
      return (
        <div>
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
          onBack={this.handleBack}
        ></PickPage>
      );
    }
  };

  /**
   * handlePick supports for switching the page the pick page
   * @param draft the operating draft that will pass to the pick page
   */
  handlePick = (draft: Draft): void => {
    this.setState({ page: { kind: "pick", draft: draft } });

    console.log("----------- draft -----------");
    console.log(draft);
    console.log("----------- draft -----------");
  };

  /**
   * handleDrafterNameChange supports for changing the name of the drafter block
   * @param curDrafterName the user input drafter name value
   */
  handleDrafterNameChange = (curDrafterName: string): void => {
    this.setState({ curDrafterName: curDrafterName });
  };

  /** handleBack supports pick page to switch back to the main page */
  handleBack = (): void => {
    this.setState({ page: "main" });
  };
}
