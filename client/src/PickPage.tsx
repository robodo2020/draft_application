import React, { Component, MouseEvent, ChangeEvent } from "react";
import { Draft, parseDraft } from "./draft";

/**
 * PickPageProps is the props that send data from parent component, which is app
 * @param initialDraft the draft data to interact with
 * @param curDrafterName the user input drafter name
 */
interface PickPageProps {
  initialDraft: Draft;
  curDrafterName: string;
}

/**
 * PickPageState is the state of the pick page component
 * @param pickedOptions the options that already picked
 * @param allOptions all the options to be picked
 * @param mainDrafter the current operating drafter
 * @param curPickOption the current user picked option
 * @param nextPicker the picker who can pick the option
 * @param completed the parameter to shows that this draft is completed
 */
interface PickPageState {
  pickedOptions: JSX.Element[];
  allOptions: JSX.Element[];
  mainDrafter: string;
  curPickOption: string;
  nextPicker: string;
  completed: boolean;
}

/** PickPage is the component to show the pick page */
export class PickPage extends Component<PickPageProps, PickPageState> {
  constructor(props: PickPageProps) {
    super(props);

    this.state = {
      pickedOptions: [],
      mainDrafter: this.props.curDrafterName,
      allOptions: [],
      curPickOption: this.props.initialDraft.allOptions[0],
      nextPicker: this.props.initialDraft.nextPicker,
      completed: false,
    };

    // this all the unpicked options
    for (const option of this.props.initialDraft.allOptions) {
      this.state.allOptions.push(<option key={option}>{option}</option>);
    }

    // list the already picked options
    for (const [option, drafter] of this.props.initialDraft.pickedOptions) {
      this.state.pickedOptions.push(
        <tr>
          <td>{option}</td>
          <td>{drafter}</td>
        </tr>
      );
    }
  }

  render = (): JSX.Element => {
    const canCurDrafterPick: boolean =
      this.state.nextPicker === this.state.mainDrafter;

    this.updatePicker(this.state.nextPicker);

    return (
      <div>
        <h1>Status of Draft "{this.props.initialDraft.draftId}"</h1>

        {/* place to show the overall picked items (what item, who picked) */}
        <div>
          <h2>Picked Items</h2>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Drater</th>
              </tr>
            </thead>
            <tbody>{this.state.pickedOptions}</tbody>
          </table>
        </div>

        {/* show who's turn & the options */}
        {/* if your turn, show the select option and save (draft) button */}
        {canCurDrafterPick && !this.state.completed && (
          <div>
            <p>It's your pick</p>
            <select onChange={this.handlePickChange}>
              {this.state.allOptions}
            </select>
            <button type="button" onClick={(evt) => this.handleSave(evt)}>
              Draft
            </button>
          </div>
        )}
        {!canCurDrafterPick && !this.state.completed && (
          <div>
            <p>Waiting for {this.state.nextPicker} to pick.</p>
            <button type="button" onClick={this.handleRefresh}>
              refresh
            </button>
          </div>
        )}

        {/* if complete, show it is complete */}
        {this.state.completed && <p>Draft is complete.</p>}
      </div>
    );
  };

  /** handleRefresh refresh the pick page to the latest picking status */
  handleRefresh = () => {
    const url =
      "/api/load" +
      "?curDrafterName=" +
      encodeURIComponent(this.state.mainDrafter) +
      "&draftId=" +
      encodeURIComponent(this.props.initialDraft.draftId);

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
      this.updateState(draft);
    }
  };

  /** updateState supports refresh the PickPage with the latest picking status */
  updateState = (draft: Draft): void => {
    // update all option
    const updateAllOption: JSX.Element[] = [];

    for (const option of draft.allOptions) {
      updateAllOption.push(<option key={option}>{option}</option>);
    }

    // update picked option
    const updatepickedOption: JSX.Element[] = [];
    for (const [option, drafter] of draft.pickedOptions) {
      updatepickedOption.push(
        <tr>
          <td>{option}</td>
          <td>{drafter}</td>
        </tr>
      );
    }

    this.setState({
      allOptions: updateAllOption,
      pickedOptions: updatepickedOption,
      curPickOption: draft.allOptions[0],
    });
    // update next picker
    this.updatePicker(draft.nextPicker);
  };

  /** handlePickChange suports for changing the pick option */
  handlePickChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const curPickOption = event.target.value;
    if (curPickOption !== undefined) {
      this.setState({ curPickOption: curPickOption });
    }
  };

  /** handleSave connects with server to update the status of the current draft */
  handleSave = (evt: MouseEvent<HTMLButtonElement>): void => {
    evt.preventDefault();
    // 1. push a save with the picked option and curDrafter into pickedOptions; remove the item in allOption, in backend,
    const url =
      "api/update" +
      "?curPickOption=" +
      this.state.curPickOption +
      "&draftId=" +
      this.props.initialDraft.draftId +
      "&curDrafter=" +
      this.state.mainDrafter;
    fetch(url, { method: "POST" })
      .then(this.handleUpdateDraft)
      .catch((err) => {
        this.handleServerError(
          "error happens during creating the new draft",
          err
        );
      });
  };

  /**  receive the updated data after creating new draft, and will converts to Json format   */
  handleUpdateDraft = (res: Response) => {
    if (res.status === 200) {
      res
        .json()
        .then(this.handleUpdateJson)
        .catch((err) => {
          this.handleServerError(
            "error happens when parsing response to Json format",
            err
          );
        });
    } else {
      this.handleServerError("error: Response from /update is not 200", res);
    }
  };

  /** handleUpdateJson update the state's pickOption & allOption and set the props of next picker. */
  handleUpdateJson = (val: any) => {
    if (typeof val !== "object" || val === null) {
      console.error("bad data from /update: not a record", val);
      return;
    }

    if (!("allOptions" in val) || typeof val.allOptions !== "object") {
      console.error("not an object: missing or invalid 'allOptions'", val);
      return;
    }

    if (!("pickedOption" in val) || typeof val.pickedOption !== "string") {
      console.error("not an object: missing or invalid 'pickedOption'", val);
      return;
    }

    if (!("curDrafter" in val) || typeof val.curDrafter !== "string") {
      console.error("not an object: missing or invalid 'curDrafter'", val);
      return;
    }
    if (!("nextPicker" in val) || typeof val.nextPicker !== "string") {
      console.error("not an object: missing or invalid 'nextPicker'", val);
      return;
    }

    console.log(val);

    const updatedAllOptions = val.allOptions;
    if (updatedAllOptions === undefined) {
      console.error("bad data of 'allOptions' from response", val);
      return;
    }
    const updatePickedOption = val.pickedOption;
    if (updatePickedOption === undefined) {
      console.error("bad data of 'pickedOption' from response", val);
      return;
    }

    const nextPicker = val.nextPicker;
    if (nextPicker === undefined) {
      console.error("bad data of 'nextPicker' from response", val);
      return;
    }

    const updatePickedOptions: JSX.Element[] = [...this.state.pickedOptions];

    updatePickedOptions.push(
      <tr>
        <td>{updatePickedOption}</td>
        <td>{val.curDrafter}</td>
      </tr>
    );

    console.log(updatePickedOptions);

    this.setState({ allOptions: updatedAllOptions });
    this.setState({ pickedOptions: updatePickedOptions });
    this.updatePicker(nextPicker);
  };

  updatePicker = (nextPicker: string) => {
    if (nextPicker === "COMPLETED!!!") {
      this.setState({ nextPicker: "", completed: true });
    } else {
      this.setState({ nextPicker: nextPicker });
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
