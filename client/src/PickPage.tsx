import React, { Component, MouseEvent, ChangeEvent } from "react";
import { Draft } from "./draft";
interface PickPageProps {
  // onPick: (draft: Draft) => void;
  initialDraft: Draft;
  curDrafterName: string;
}

interface PickPageState {
  // options: string; // should it be string[]?
  // drafters: string; // should it be string[]?
  // rounds: number;
  // curDrafterName: string;
  pickedOptions: JSX.Element[];
  allOptions: JSX.Element[];
  mainDrafter: string;

  curPickOption: string;
}

export class PickPage extends Component<PickPageProps, PickPageState> {
  constructor(props: PickPageProps) {
    super(props);

    this.state = {
      pickedOptions: [],
      mainDrafter: this.props.curDrafterName,
      allOptions: [],
      curPickOption: "",
    };

    // this all the  unpicked options
    for (const option of this.props.initialDraft.allOptions) {
      this.state.allOptions.push(<option>{option}</option>);
    }

    // list the already picked options
    for (const [option, drafter] of this.props.initialDraft.pickedOptions) {
      // change to table
      this.state.pickedOptions.push(
        <tr>
          <td>{option}</td>
          <td>{drafter}</td>
        </tr>
      );
    }
  }

  render = (): JSX.Element => {
    const youPick: boolean =
      this.props.curDrafterName === this.state.mainDrafter;
    const otherPick: boolean =
      this.props.curDrafterName !== this.state.mainDrafter;

    console.log(this.state.allOptions);

    return (
      <div>
        {/* need an varible to show the draft id */}
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
            <tbody>
              {this.state.pickedOptions}
              {/* {data.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.age}</td>
          </tr>
        ))} */}
            </tbody>
          </table>
        </div>

        {/* show who's turn & the options */}
        {/* if your turn, show the select option and save (draft) button */}
        {youPick && (
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
        {otherPick && (
          <div>
            <p>Waiting for {this.props.curDrafterName} to pick.</p>
            <button>refresh</button>
          </div>
        )}

        {/* if complete, show it is complete */}
      </div>
    );
  };

  handlePickChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const curPickOption = event.target.value;
    if (curPickOption !== undefined) {
      this.setState({ curPickOption: curPickOption });
    }
  };

  handleSave = (evt: MouseEvent<HTMLButtonElement>): void => {
    evt.preventDefault();
    // 1. push a save with the picked option and curDrafter into pickedOptions; remove the item in allOption, in backend,
    const url =
      "api/save" +
      "?curPickOption=" +
      this.state.curPickOption +
      "&draftId=" +
      this.props.initialDraft.draftId +
      "&curDrafter=" +
      this.state.mainDrafter;
    fetch(url, { method: "POST" })
      .then(this.handleUpdateAllOption)
      .catch((err) => {
        this.handleServerError(
          "error happens during creating the new draft",
          err
        );
      });
    // 2. update the state's pickOption & allOption

    // 3. set the props curDrafter to next person in queue.
  };
  handleUpdateAllOption = (res: Response) => {
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

    console.log(val);

    // const draft: Draft | undefined = parseDraft(val);
    const updatedAllOptions = val.allOptions;
    const updatePickedOption = val.pickedOption;
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
  };

  /**
   * handleServerError handles the server error with the customized message
   * @param err the error message
   */
  handleServerError = (err: string, _: Response) => {
    console.error(err);
  };
}
