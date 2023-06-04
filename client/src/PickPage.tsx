import React, { Component } from "react";
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
  unpickedOptions: JSX.Element[];
  mainDrafter: string;
}

export class PickPage extends Component<PickPageProps, PickPageState> {
  constructor(props: PickPageProps) {
    super(props);

    this.state = {
      pickedOptions: [],
      mainDrafter: this.props.initialDraft.curDrafterName,
      unpickedOptions: [],
    };

    // this all the  unpicked options
    console.log(typeof this.props.initialDraft.allOptions);
    for (const [option, count] of this.props.initialDraft.allOptions) {
      // console.log("-----");
      // console.log(option);
      // console.log("-----");

      for (let i = 0; i < count; i++) {
        this.state.unpickedOptions.push(<option>{option}</option>);
      }
    }

    // list the already picked options
    for (const [option, count] of this.props.initialDraft.pickedItems) {
      for (let i = 0; i < count; i++) {
        this.state.pickedOptions.push(
          <li key={option}>
            <a href="#">{option}</a>
          </li>
        );
      }
    }
  }

  render = (): JSX.Element => {
    // const pickedOptions : JSX.Element[] = [];
    // for (const option of this.state.)
    const youPick: boolean =
      this.props.curDrafterName === this.state.mainDrafter;
    const otherPick: boolean =
      this.props.curDrafterName !== this.state.mainDrafter;
    // if (this.props.curDrafterName === this.state.mainDrafter) {
    //   whosPicking = "It's your pick";
    // } else {
    //   whosPicking = "Waiting for" + this.props.curDrafterName + "to pick.";
    // }
    console.log(this.state.unpickedOptions);

    return (
      <div>
        {/* need an varible to show the draft id */}
        <h1>Status of Draft "{this.props.initialDraft.draftId}"</h1>

        {/* place to show the overall picked items (what item, who picked) */}
        <div>
          <h2>Picked Items</h2>
          {this.state.pickedOptions}
        </div>

        {/* show who's turn & the options */}
        {/* if your turn, show the select option and save(draft) button */}
        {youPick && (
          <div>
            <p>It's your pick</p>
            <select>{this.state.unpickedOptions}</select>
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
}
