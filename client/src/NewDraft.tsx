import React, { Component } from "react";

export class NewDraft extends Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }

  render = (): JSX.Element => {
    return (
      <div>
        <h2>Create New Draft</h2>
        <label htmlFor="name">Rounds: </label>
        <input id="name" type="text"></input>

        <div style={{ display: "flex", gap: "1px" }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="options">Options (one per line)</label>
            <div>
              <textarea style={{ maxWidth: "300px", height: "300px" }} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="options">Drafter(one per line, in order)</label>
            <div>
              <textarea style={{ maxWidth: "300px", height: "300px" }} />
            </div>
          </div>
        </div>
        <button type="button">Join</button>
      </div>
    );
  };
}
