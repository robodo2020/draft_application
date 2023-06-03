import { Request, Response } from "express";
import { makeSimpleDraft, simpleDraft } from "./draft";

// can we create a global id as draft id?
let INITDRAFTID: number = 0;

// DraftMap is the main database to store all the Draft Information
const DraftMap: Map<number, simpleDraft> = new Map();

export function addDraft(req: Request, res: Response) {
  const curDrafter = req.query.curDrafter;
  if (curDrafter === undefined || typeof curDrafter !== "string") {
    res.status(400).send("missing 'curDrafter' parameter");
    return;
  }

  // TODO: check can turn to int
  const rounds = req.query.rounds;
  if (rounds === undefined || typeof rounds !== "string") {
    res.status(400).send("missing 'rounds' parameter");
    return;
  }

  const options = req.query.options;
  if (options === undefined || typeof options !== "string") {
    res.status(400).send("missing 'options' parameter");
    return;
  }

  const drafters = req.query.drafters;
  if (drafters === undefined || typeof drafters !== "string") {
    res.status(400).send("missing 'drafters' parameter");
    return;
  }

  const draft: simpleDraft = makeSimpleDraft(
    curDrafter,
    parseInt(rounds),
    options,
    drafters
  );

  DraftMap.set(INITDRAFTID, draft);
  INITDRAFTID++;

  console.log(DraftMap);
  res.send(draft);
}

// load the exists drafts
// export function loadExistDrafts(req: Request, res: Response) {
export function loadExistDrafts(_: Request, res: Response) {
  res.send(DraftMap);

  // console.log("testtesttest");
  // const draftIdStr = req.query.draftId;

  // if (draftIdStr === undefined || typeof draftIdStr !== "string") {
  //   res.status(400).send("missing 'draftId' parameter");
  //   return;
  // }
  // const draftId = parseInt(draftIdStr);

  // const curDrafterName = req.query.curDrafterName;
  // if (curDrafterName === undefined || typeof curDrafterName !== "string") {
  //   res.status(400).send("missing 'curDrafter' parameter");
  //   return;
  // }

  // // check if curDrafter exist in map

  // // currently assume id definitely exists
  // // currently assume curDrafter definitely exists
  // const curDraft = DraftMap.get(draftId);
  // if (curDraft === undefined) {
  //   res.status(400).send("draftId doesn't exist");
  //   return;
  // }

  // if (!curDraft.drafters.has(curDrafterName)) {
  //   res.status(400).send("drafter name doesn't exist");
  //   return;
  // }

  // curDraft.curDrafter = curDrafterName;
  // console.log(curDraft);
  // res.send(curDraft);
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
