import { Request, Response } from "express";

type Draft = {
  rounds: number;
  allOptions: string[];
  drafters: string[];
  pickedOptions: [string, string][]; // option, drafter
  pickQueue: string[];
};

let INITDRAFTID: number = 0;

// DraftMap is the main database to store all the Draft Information
// TODO: change to use SQL server
const DraftMap: Map<number, Draft> = new Map();

/**
 * addDraft stores the request draft data to server
 * @param req the request draft that requires rounds, options, drafters information
 * @param res the organized draft information
 */
export function addDraft(req: Request, res: Response) {
  const rounds = req.query.rounds;
  if (rounds === undefined || typeof rounds !== "string") {
    res.status(400).send("missing 'rounds' parameter");
    return;
  }

  const options = req.query.options;
  if (options === undefined || typeof options !== "string") {
    console.log(options);
    res.status(400).send("missing 'options' parameter");
    return;
  }

  const drafters = req.query.drafters;
  if (drafters === undefined || typeof drafters !== "string") {
    console.log(drafters);
    res.status(400).send("missing 'drafters' parameter");
    return;
  }
  // put data in our server side
  const draft: Draft | undefined = makeDraft(rounds, options, drafters);

  if (draft === undefined) {
    res.status(400).send("Error happens when creating draft object");
    console.error("Error: the draft has invalid input");
    return;
  }

  DraftMap.set(INITDRAFTID, draft);
  console.log(DraftMap);

  // send data to client side
  res.send({
    draftId: INITDRAFTID,
    pickedOptions: draft.pickedOptions,
    rounds: draft.rounds,
    allOptions: draft.allOptions,
    drafters: draft.drafters,
    nextPicker: draft.pickQueue[0],
  });

  INITDRAFTID++;
}

// load the exists drafts
/**
 * loadExistDrafts will load the existed drafts in the server and send it to client
 * @param req the reuqest that needs current Drafter Name and the draft Id
 * @param res the response that returns exists draft information
 * @requires draftId exists in map
 */
export function loadExistDrafts(req: Request, res: Response) {
  const curDrafterName = req.query.curDrafterName;
  if (curDrafterName === undefined || typeof curDrafterName !== "string") {
    res.status(400).send("missing 'curDrafter' parameter");
    return;
  }
  const draftIdStr = req.query.draftId;
  if (draftIdStr === undefined || typeof draftIdStr !== "string") {
    res.status(400).send("missing 'draftId' parameter");
    return;
  }
  const draftId = parseInt(draftIdStr);

  // check if curDrafter exist in map
  // currently assume id definitely exists
  // currently assume curDrafter definitely exists
  const curDraft = DraftMap.get(draftId);
  if (curDraft === undefined) {
    res.status(400).send("draftId doesn't exist");
    return;
  }

  console.log(curDraft);

  let nextPicker: string = "";
  if (curDraft.pickQueue.length > 0) {
    nextPicker = curDraft.pickQueue[0];
  } else {
    nextPicker = "COMPLETED!!!";
  }

  res.send({
    draftId: draftId,
    pickedOptions: curDraft.pickedOptions,
    rounds: curDraft.rounds,
    allOptions: curDraft.allOptions,
    drafters: curDraft.drafters,
    nextPicker: nextPicker,
  });
}

/**
 * updateDraft operates the draft when a drafter pick an item
 * @param req require request that needs the picked Option, draftId, current drafter
 * @param res
 * @requires picked Option is existed in the draft all options
 */
export function updateDraft(req: Request, res: Response) {
  const curPickOption = req.query.curPickOption;
  if (curPickOption === undefined || typeof curPickOption !== "string") {
    res.status(400).send("missing 'curPickOption' parameter");
    return;
  }

  const draftIdStr = req.query.draftId;
  if (draftIdStr === undefined || typeof draftIdStr !== "string") {
    res.status(400).send("missing 'draftId' parameter");
    return;
  }

  const curDrafter = req.query.curDrafter;
  if (curDrafter === undefined || typeof curDrafter !== "string") {
    res.status(400).send("missing 'curDrafter' parameter");
    return;
  }

  const draftId = parseInt(draftIdStr);
  const curDraft = DraftMap.get(draftId);
  if (curDraft === undefined) {
    res.status(400).send("draftId doesn't exist");
    return;
  }

  curDraft.pickedOptions.push([curPickOption, curDrafter]);
  const itemIdx = curDraft.allOptions.indexOf(curPickOption);
  if (itemIdx === -1) {
    res.status(400).send("curPickOption doesn't exist in the allOptions");
    return;
  }
  curDraft.allOptions.splice(itemIdx, 1);
  curDraft.pickQueue.shift();

  let nextPicker: string = "";
  if (curDraft.pickQueue.length > 0) {
    nextPicker = curDraft.pickQueue[0];
  } else {
    nextPicker = "COMPLETED!!!";
  }

  res.send({
    allOptions: curDraft.allOptions,
    pickedOption: curPickOption,
    curDrafter: curDrafter,
    nextPicker: nextPicker,
  });
}

/** Returns a list of all the named save files. */
export function Dummy(req: Request, res: Response) {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
  } else {
    res.json(`Hi, ${name}`);
  }
}

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
function first(param: any): string | undefined {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === "string") {
    return param;
  } else {
    return undefined;
  }
}

/**
 * toList supports to transform a string to list of items
 * @param itemsString the original string items input from users
 * @requires itemsString the item separats by '\n'
 */
function toList(itemsString: string): string[] {
  const itemsList: string[] = itemsString
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item !== "");

  return itemsList;
}

/**
 * checkAllItemValid checks whether the input contains invalid items
 * @param itemsList the list of items, will check the drafters in the usage
 * @returns boolean indicates the list is valid or not
 */
function checkAllItemValid(itemsList: string[]): boolean {
  for (const item of itemsList) {
    if (item === "COMPLETED!!!") {
      return false;
    }
  }
  return true;
}

/**
 * makeDraft is the facotry function to generate a Draft object
 * @param rounds the num of rounds for this draft
 * @param allOptions all the options of this draft
 * @param drafters all the drafters of this draft
 * @returns Draft object
 */
export function makeDraft(
  rounds: string,
  allOptions: string,
  drafters: string
): Draft | undefined {
  const allOptionsList: string[] = toList(allOptions);
  const allDraftersList: string[] = toList(drafters);
  const roundsNum: number = parseInt(rounds);

  if (allDraftersList.length * roundsNum > allOptionsList.length) {
    console.error("Error: drafters cannot less than options");
    return undefined;
  }

  if (!checkAllItemValid(allDraftersList)) {
    console.error("Error: the Drafters contains invalid words");
    return undefined;
  }

  const draft: Draft = {
    rounds: roundsNum,
    allOptions: allOptionsList,
    drafters: allDraftersList,
    pickedOptions: [],
    pickQueue: [],
  };

  // push drafter turn to pickQueue
  for (let i = 0; i < draft.rounds; i++) {
    for (const drafter of draft.drafters) {
      draft.pickQueue.push(drafter);
    }
  }

  return draft;
}
