import React, { Component } from "react";

export class NewDraft extends Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }

  render = (): JSX.Element => {
    return (
      <div>
        {/* need an varible to show the draft id */}
        <h2>Status of Draft {}</h2>

        {/* place to show the already picked items */}

        {/* show who's turn*/}

        {/* if your turn, show the select option and save(draft) button */}
        {/* else, show the refresh button */}

        {/* if complete, show it is complete */}
      </div>
    );
  };
}
