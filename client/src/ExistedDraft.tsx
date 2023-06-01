import React, { Component } from "react";

export class ExistedDraft extends Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }

  render = (): JSX.Element => {
    return (
      <div>
        <h2>Join Existing Draft</h2>
        <label htmlFor="name">Draft ID: </label>
        <input id="name" type="text"></input>
        <div>
          <button type="button">Join</button>
        </div>
      </div>
    );
  };
}
