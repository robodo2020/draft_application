export type Draft = {
  draftId: number;
  rounds: number;
  pickedOptions: string[];
  allOptions: string[];
  nextPicker: string;
};

/**
 * toList helps to turns is a string to list of string
 * @param itemsString the input string to be transformed
 * @requires string separated by "\n"
 * @returns list of string
 */
export function toList(itemsString: string): string[] {
  const itemsList: string[] = itemsString
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item !== "");

  return itemsList;
}

/**
 * hasDuplicate will check whether input string has duplicate item
 * @param item  the input string that will use toList to turn to list of string, then check if there's duplicate
 * @returns boolean that true is has duplicate, false is doesn't have duplicate
 */
export function hasDuplicate(item: string): boolean {
  const itemsList: string[] = toList(item);
  const set: Set<string> = new Set();
  for (const item of itemsList) {
    if (set.has(item)) {
      return true;
    } else {
      set.add(item);
    }
  }
  return false;
}

/**
 * parseDraft supports to convert the draft data sent from server side, organized and return as Draft object
 * @param val the input data that sent from server side
 * @requires val should have parameters of draftId, pickedOptions, rounds, allOptions, and nextPicker
 * @returns the organized Draft object
 */
export function parseDraft(val: any): undefined | Draft {
  if (typeof val !== "object" || val === null) {
    console.error("not a Draft", val);
    return undefined;
  }
  if (!("draftId" in val) || typeof val.draftId !== "number") {
    console.error("not an object: missing or invalid 'draftId'", val);
    return undefined;
  }

  if (!("pickedOptions" in val) || typeof val.pickedOptions !== "object") {
    console.error("not an object: missing or invalid 'pickedOptions'", val);
    return undefined;
  }

  if (!("rounds" in val) || typeof val.rounds !== "number") {
    console.error("not an object: missing or invalid 'rounds'", val);
    return undefined;
  }

  if (!("allOptions" in val) || typeof val.allOptions !== "object") {
    console.error("not an object: missing or invalid 'allOptions'", val);
    return undefined;
  }

  if (!("nextPicker" in val) || typeof val.nextPicker !== "string") {
    console.error("not an object: missing or invalid 'nextPicker'", val);
    return undefined;
  }
  // the val contains drafters, but we currently don't need it
  // Didn't pass the drafters

  return {
    draftId: val.draftId,
    pickedOptions: val.pickedOptions,
    rounds: val.rounds,
    allOptions: val.allOptions,
    nextPicker: val.nextPicker,
  };
}
