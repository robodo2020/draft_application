import { Request, Response } from "express";
// import { countDraft } from "./draft";

type Draft = {
  rounds: number;
  allOptions: string[];
  drafters: string[];
  pickedOptions: [string, string][]; // option, drafter
  pickQueue: string[];
};

// can we create a global id as draft id?
let INITDRAFTID: number = 0;

// DraftMap is the main database to store all the Draft Information
const DraftMap: Map<number, Draft> = new Map();

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
  const draft: Draft = makeDraft(rounds, options, drafters);

  DraftMap.set(INITDRAFTID, draft);
  console.log(DraftMap);

  // const nextPicker = draft.pickQueue.shift();
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
// export function loadExistDrafts(req: Request, res: Response) {
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

  res.send({
    draftId: draftId,
    pickedOptions: curDraft.pickedOptions,
    rounds: curDraft.rounds,
    allOptions: curDraft.allOptions,
    drafters: curDraft.drafters,
    nextPicker: curDraft.pickQueue[0],
  });
}

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

function toList(itemsString: string): string[] {
  const itemsList: string[] = itemsString
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item !== "");

  return itemsList;
}

export function makeDraft(
  rounds: string,
  allOptions: string,
  drafters: string
): Draft {
  const draft: Draft = {
    rounds: parseInt(rounds),
    allOptions: toList(allOptions),
    drafters: toList(drafters),
    pickedOptions: [],
    pickQueue: [],
  };
  for (let i = 0; i < draft.rounds; i++) {
    for (const drafter of draft.drafters) {
      draft.pickQueue.push(drafter);
    }
  }

  return draft;
}
