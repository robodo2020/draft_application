import { Request, Response } from "express";
import { makeCountDraft, countDraft } from "./draft";

// can we create a global id as draft id?
let INITDRAFTID: number = 0;

// DraftMap is the main database to store all the Draft Information
const DraftMap: Map<number, countDraft> = new Map();

export function addDraft(req: Request, res: Response) {
  const curDrafterName = req.query.curDrafterName;
  if (curDrafterName === undefined || typeof curDrafterName !== "string") {
    res.status(400).send("missing 'curDrafter' parameter");
    return;
  }

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
  const draft: countDraft = makeCountDraft(
    curDrafterName,
    parseInt(rounds),
    options,
    drafters
  );

  DraftMap.set(INITDRAFTID, draft);

  // send data to client side
  const allOptionsObject = Object.fromEntries(draft.options);
  const allOptionsJson = JSON.stringify(allOptionsObject);

  const selectedOptions = draft.drafters.get(draft.curDrafterName);
  if (selectedOptions === undefined) {
    throw new Error("curDrafterName doesn't exist inside draft map");
  }
  const selectedOptionsObject = Object.fromEntries(selectedOptions);
  const selectedOptionsJson = JSON.stringify(selectedOptionsObject);

  console.log(DraftMap);
  res.send({
    draftId: INITDRAFTID,
    curDrafterName: draft.curDrafterName,
    pickedItems: selectedOptionsJson,
    rounds: draft.rounds, // TODO: maybe need to send curRound record
    allOptions: allOptionsJson,
    // TODO: who's executing round name
  });

  INITDRAFTID++;
}

// load the exists drafts
// export function loadExistDrafts(req: Request, res: Response) {
export function loadExistDrafts(req: Request, res: Response) {
  console.log("testtesttest");
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
  // TODO: might affect due to this line is get method
  curDraft.curDrafterName = curDrafterName;

  const selectedOptions = curDraft.drafters.get(curDraft.curDrafterName);
  if (selectedOptions === undefined) {
    res.status(400).send("drafter name doesn't exist in this draft");
    return;
  }

  // make it Jsonize
  const allOptionsObject = Object.fromEntries(curDraft.options);
  const allOptionsJson = JSON.stringify(allOptionsObject);

  const selectedOptionsObject = Object.fromEntries(selectedOptions);
  const selectedOptionsJson = JSON.stringify(selectedOptionsObject);

  console.log(curDraft);

  res.send({
    draftId: draftId,
    curDrafterName: curDrafterName,
    pickedItems: selectedOptionsJson,
    rounds: curDraft.rounds, // TODO: maybe need to send curRound record
    allOptions: allOptionsJson,
  });
}

// method to list the chosen options by the input drafter
export function listChosenOptionsByDrafter() {}

// method for drafter to pick
export function pickOption() {}

// not sure if needed
// function switchPickingDrafter() {}

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
