import React, { Component } from "react";


interface AppState {
  // will probably need something here
}


export class App extends Component<{}, AppState> {

  constructor(props: any) {
    super(props);

    this.state = {};
  }
  
  render = (): JSX.Element => {
    return <p>Hi</p>
  };

}
