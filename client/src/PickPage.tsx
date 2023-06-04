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
  nextPicker: string;
  completed: boolean;
}

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
    const canCurDrafterPick: boolean =
      this.state.nextPicker === this.state.mainDrafter;

    // console.log(this.state.allOptions);

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
            <button>refresh</button>
          </div>
        )}

        {/* if complete, show it is complete */}
        {this.state.completed && <p>Draft is complete.</p>}
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
      .then(this.handleUpdateDraft)
      .catch((err) => {
        this.handleServerError(
          "error happens during creating the new draft",
          err
        );
      });
    // 2. update the state's pickOption & allOption

    // 3. set the props curDrafter to next person in queue.
  };
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

    // const draft: Draft | undefined = parseDraft(val);
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
