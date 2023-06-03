import React, { Component, ChangeEvent, MouseEvent } from "react";
// import { Draft } from "./draft";

interface ExistedProps {
  // onPick: (draft: Draft) => void;
  // onPick: () => void;
}

interface ExistedState {
  curDrafterName: string;
  draftId: string;
}

export class ExistedDraft extends Component<ExistedProps, ExistedState> {
  constructor(props: ExistedProps) {
    super(props);

    this.state = {
      curDrafterName: "",
      draftId: "",
    };
  }

  render = (): JSX.Element => {
    return (
      <div>
        <h2>Join Existing Draft</h2>
        <div>
          <label htmlFor="name">Drafter: </label>
          <input
            id="name"
            type="text"
            value={this.state.curDrafterName}
            onChange={this.handleCurDrafterChange}
          ></input>
        </div>

        {/* TODO: show the existed draft as option */}
        <label htmlFor="draftId">Draft ID: </label>
        <input
          id="draftId"
          type="number"
          value={this.state.draftId}
          onChange={this.handledraftId}
        ></input>
        <div>
          <button type="button" onClick={this.handleJoinExist}>
            Join
          </button>
        </div>
      </div>
    );
  };

  handleCurDrafterChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ curDrafterName: evt.target.value });
  };
  handledraftId = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ draftId: evt.target.value });
  };

  // TODO: join the exist draft
  handleJoinExist = (_: MouseEvent<HTMLButtonElement>): void => {
    const url = "/api/list";

    // const url =
    //   "/api/list" +
    //   "?curDrafterName=" +
    //   encodeURIComponent(this.state.curDrafterName) +
    //   "&draftId=" +
    //   encodeURIComponent(this.state.draftId);

    fetch(url, { method: "GET" })
      .then(this.handleExistDraft)
      // .then(this.props.onPick)
      .catch((err) => {
        this.handleServerError(
          "error happens during joining existing draft",
          err
        );
      });
  };
  handleExistDraft = (res: Response): void => {
    console.log("---------");
    console.log(res); // the draft data send from backend
    console.log("---------");
    if (res.status === 200) {
      console.log(res.json);
      res
        .json()
        .then(this.handleJoinExistDraft)
        .catch(() =>
          this.handleServerError(
            "error happens when parsing the draft result",
            res
          )
        );
    } else {
      this.handleServerError(
        "error happens on handling join during response to server",
        res
      );
    }
  };

  handleJoinExistDraft = (val: any): void => {
    console.log(val);
    if (val === null) {
      console.error("bad data from /list: no draft data", val);
      return;
    }

    // console.log()

    // const square: Square = fromJson(val);
    // console.log(square);
    // if (square === undefined) {
    //   this.handleServerError("loaded square is undefined", val);
    // }

    // this.props.onShow(square, this.state.selectedFileName); // pass the square to app
  };

  /**
   * handleServerError handles the server error with the customized message
   * @param err the error message
   */
  handleServerError = (err: string, _: Response) => {
    console.error(err);
  };
}
