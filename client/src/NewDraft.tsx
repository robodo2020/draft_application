import React, { Component, MouseEvent, ChangeEvent } from "react";
// import { makeSimpleDraft, simpleDraft } from "./simpleDraft";
import { Draft, parseDraft, hasDuplicate } from "./draft";
interface NewDraftProps {
  onPick: (draft: Draft) => void;
}

interface NewDraftState {
  options: string; // should it be string[]?
  drafters: string; // should it be string[]?
  rounds: number;
  curDrafterName: string;
}

export class NewDraft extends Component<NewDraftProps, NewDraftState> {
  constructor(props: NewDraftProps) {
    super(props);

    this.state = {
      options: "",
      drafters: "",
      rounds: 1,
      curDrafterName: "",
    };
  }

  render = (): JSX.Element => {
    return (
      <div>
        <h2>Create New Draft</h2>
        <div>
          <label htmlFor="name">Drafter: </label>
          <input
            id="name"
            type="text"
            value={this.state.curDrafterName}
            onChange={this.handleCurDrafterChange}
          ></input>
        </div>
        <label htmlFor="rounds">Rounds: </label>
        <input
          id="rounds"
          type="number"
          min="1"
          value={this.state.rounds}
          onChange={this.handleRoundChange}
        ></input>

        <div style={{ display: "flex", gap: "1px" }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="options">Options (one per line)</label>
            <div>
              <textarea
                style={{ maxWidth: "300px", height: "300px" }}
                id="options"
                value={this.state.options}
                onChange={this.handleOptionsChange}
              />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="drafters">Drafter(one per line, in order)</label>
            <div>
              <textarea
                style={{ maxWidth: "300px", height: "300px" }}
                id="drafters"
                value={this.state.drafters}
                onChange={this.handleDraftersChange}
              />
            </div>
          </div>
        </div>
        <button type="button" onClick={this.handleAdd}>
          Join
        </button>
      </div>
    );
  };

  handleCurDrafterChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ curDrafterName: evt.target.value });
  };

  handleRoundChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ rounds: parseInt(evt.target.value) });
  };

  handleOptionsChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({ options: evt.target.value });
  };

  handleDraftersChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({ drafters: evt.target.value });
  };

  handleAdd = (_: MouseEvent<HTMLButtonElement>): void => {
    if (
      this.state.rounds > 0 &&
      this.state.options.length > 0 &&
      this.state.drafters.length > 0
    ) {
      // organize the data first, then send to backend
      // check drafter no duplicate
      if (hasDuplicate(this.state.drafters)) {
        console.error("drafter cannot put duplicate item");
        return;
      }
      // TODO: check curDrafterName in drafter or not
      // will add curDrafterName to this.state.drafters, currently assume it exist in

      const url =
        "/api/add" +
        "?curDrafterName=" +
        encodeURIComponent(this.state.curDrafterName) +
        "&rounds=" +
        encodeURIComponent(this.state.rounds) +
        "&options=" +
        encodeURIComponent(this.state.options) +
        "&drafters=" +
        encodeURIComponent(this.state.drafters);
      fetch(url, { method: "POST" })
        .then(this.handleAddResponse)
        // .then(this.props.onPick)
        .catch((err) => {
          this.handleServerError(
            "error happens during creating the new draft",
            err
          );
        });
    }
  };

  // the reason need this is because use this data for picking
  handleAddResponse = (res: Response) => {
    if (res.status === 200) {
      res
        .json()
        .then(this.handleAddJson)
        .catch((err) => {
          this.handleServerError("", err);
        });
    } else {
      this.handleServerError("", res);
    }
  };

  // the data sent from backend side
  handleAddJson = (val: any) => {
    if (typeof val !== "object" || val === null) {
      console.error("bad data from /add: not a record", val);
      return;
    }

    console.log("check point0");
    console.log(val);

    const draft = parseDraft(val);
    if (draft !== undefined) {
      this.props.onPick(val);
    }
  };

  /**
   * handleServerError handles the server error with the customized message
   * @param err the error message
   */
  handleServerError = (err: string, _: Response) => {
    console.error(err);
  };
}
