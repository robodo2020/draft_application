import React, { Component } from "react";
import { ExistedDraft } from "./ExistedDraft"; //error for e
import { NewDraft } from "./NewDraft";

interface AppState {
  // will probably need something here
}

export class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);

    this.state = {};
  }

  render = (): JSX.Element => {
    return (
      <div>
        <div>
          <label htmlFor="name">Drafter: </label>
          <input id="name" type="text"></input>
        </div>
        <ExistedDraft></ExistedDraft>
        <NewDraft></NewDraft>
      </div>
    );
  };
}
