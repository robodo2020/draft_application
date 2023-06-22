import React, { Component, ChangeEvent, MouseEvent } from "react";
import { parseDraft, Draft } from "./draft";

interface ExistedProps {
  /**
   * onPick pass the draft object to app, in order to be passed to PickPage
   * @param draft the Draft object that will operate the pick item in PickPage
   */
  onPick: (draft: Draft) => void;

  /**
   * onDrafterNameChange supports for changing the name in the drafter name input block
   * @param curDrafterName the user input drafter name
   */
  onDrafterNameChange: (curDrafterName: string) => void;
}

/**
 * ExistedState stores the state of the ExistedDraft component
 * @param curDrafterName the current drafter name
 * @param draftId the Id of the draft from server side
 */
interface ExistedState {
  curDrafterName: string;
  draftId: number;
}

/** ExistedDraft is the component that joins the exist page to operate */
export class ExistedDraft extends Component<ExistedProps, ExistedState> {
  constructor(props: ExistedProps) {
    super(props);

    this.state = {
      curDrafterName: "",
      draftId: 0,
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
            onChange={this.handleCurDrafterNameChange}
          ></input>
        </div>

        {/* show the existed draft as option */}
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

  /** handleCurDrafterNameChange suports for change the current drafter name */
  handleCurDrafterNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ curDrafterName: evt.target.value });
  };

  /** handledraftId supports for changing the draft Id by user input  */
  handledraftId = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ draftId: parseInt(evt.target.value) });
  };

  /** handleJoinExist connects with server to retrieve the draft raw data */
  handleJoinExist = (_: MouseEvent<HTMLButtonElement>): void => {
    const url =
      "/api/load" +
      "?curDrafterName=" +
      encodeURIComponent(this.state.curDrafterName) +
      "&draftId=" +
      encodeURIComponent(this.state.draftId);

    fetch(url, { method: "GET" })
      .then(this.handleGetExistDraft)
      .catch((err) => {
        this.handleServerError(
          "error happens during retrieving existing draft",
          err
        );
      });
  };

  /** handleGetExistDraft converts the draft raw data to Json format */
  handleGetExistDraft = (res: Response): void => {
    if (res.status === 200) {
      res
        .json()
        .then(this.handleGetExistDraftJson)
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

  /** handleGetExistDraftJson parse the Json data to draft object */
  handleGetExistDraftJson = (val: any): void => {
    if (typeof val !== "object" || val === null) {
      console.error("bad data from /load: not a record", val);
      return;
    }

    const draft = parseDraft(val);

    if (draft !== undefined) {
      this.props.onPick(val);
      this.props.onDrafterNameChange(this.state.curDrafterName);
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
