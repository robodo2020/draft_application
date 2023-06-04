import React, { Component, MouseEvent, ChangeEvent } from "react";
// import { makeSimpleDraft, simpleDraft } from "./simpleDraft";
import { Draft, parseDraft, hasDuplicate } from "./draft";
interface NewDraftProps {
  onPick: (draft: Draft) => void;
  onDrafterNameChange: (curDrafterName: string) => void;
}

interface NewDraftState {
  options: string; // should it be string[]?
  drafters: string; // should it be string[]?
  rounds: number;
  curDrafterName: string;
  draftId: number;
}

export class NewDraft extends Component<NewDraftProps, NewDraftState> {
  constructor(props: NewDraftProps) {
    super(props);

    this.state = {
      options: "",
      drafters: "",
      rounds: 1,
      curDrafterName: "",
      draftId: -1,
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
            onChange={this.handleCurDrafterNameChange}
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

  handleCurDrafterNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
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
        "?rounds=" +
        encodeURIComponent(this.state.rounds) +
        "&options=" +
        encodeURIComponent(this.state.options) +
        "&drafters=" +
        encodeURIComponent(this.state.drafters);
      fetch(url, { method: "POST" })
        .then(this.handleAddResponse)
        .catch((err) => {
          this.handleServerError(
            "error happens during creating the new draft",
            err
          );
        });
      // .then(this.handleRetrieveNextPicker)
      // .catch((err) => {
      //   this.handleServerError(
      //     "error happens during retrieving the next picker",
      //     err
      //   );
      // });
    }
  };

  // the reason need this is because use this data for picking
  handleAddResponse = (res: Response) => {
    console.log(res);
    if (res.status === 200) {
      res
        .json()
        .then(this.handleAddJson)
        .catch((err) => {
          this.handleServerError(
            "error happens when parsing response to Json format",
            err
          );
        });
    } else {
      this.handleServerError("error: Response from /add is not 200", res);
    }
  };

  // the data sent from backend side
  handleAddJson = (val: any) => {
    if (typeof val !== "object" || val === null) {
      console.error("bad data from /add: not a record", val);
      return;
    }

    console.log(val);

    const draft: Draft | undefined = parseDraft(val);

    console.log("========");
    console.log(draft);
    console.log("========");
    if (draft !== undefined) {
      this.setState({ draftId: draft.draftId });
      this.props.onPick(draft);
      this.props.onDrafterNameChange(this.state.curDrafterName); // ?
    }
  };

  // handleRetrieveNextPicker = () => {
  //   const url =
  //     "/api/picker" + "?draftId=" + encodeURIComponent(this.state.draftId);
  //   fetch(url, { method: "POST" })
  //     .then(this.handlePickerResponse)
  //     .catch((err) => {
  //       this.handleServerError(
  //         "error happens during connecting with /picker server",
  //         err
  //       );
  //     });
  // };

  // handlePickerResponse = (res: Response) => {
  //   if (res.status === 200) {
  //     res
  //       .json()
  //       .then(this.handlePickerJson)
  //       .catch((err) => {
  //         this.handleServerError(
  //           "error happens when parsing response to Json format",
  //           err
  //         );
  //       });
  //   } else {
  //     this.handleServerError("error: Response from /picker is not 200", res);
  //   }
  // };

  // handlePickerJson = (val: any) => {
  //   if (typeof val !== "object" || val === null) {
  //     console.error("bad data from /add: not a record", val);
  //     return;
  //   }
  //   const nextPicker = val.nextPicker;

  //   if (nextPicker !== undefined) {
  //    // set something to nextPicker
  //   }
  // };

  /**
   * handleServerError handles the server error with the customized message
   * @param err the error message
   */
  handleServerError = (err: string, _: Response) => {
    console.error(err);
  };
}
