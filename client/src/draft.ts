export type Draft = {
  draftId: number;
  rounds: number;
  pickedOptions: string[];
  allOptions: string[];
  nextPicker: string;
};

export function toList(itemsString: string): string[] {
  const itemsList: string[] = itemsString
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item !== "");

  return itemsList;
}

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

// data sent from backend
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
