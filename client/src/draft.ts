type countItems = Map<string, number>;
export type Draft = {
  draftId: number;
  curDrafterName: string;
  rounds: number;
  pickedItems: countItems;
  allOptions: countItems;
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
  console.log(val);

  if (typeof val !== "object" || val === null) {
    console.error("not a Draft", val);
    return undefined;
  }
  if (!("draftId" in val) || typeof val.draftId !== "number") {
    console.error("not an object: missing or invalid 'draftId'", val);
    return undefined;
  }

  if (!("curDrafterName" in val) || typeof val.curDrafterName !== "string") {
    console.error("not an object: missing or invalid 'curDrafterName'", val);
    return undefined;
  }

  if (!("pickedItems" in val) || typeof val.pickedItems !== "string") {
    console.error("not an object: missing or invalid 'pickedItems'", val);
    return undefined;
  }

  if (!("rounds" in val) || typeof val.rounds !== "number") {
    console.error("not an object: missing or invalid 'rounds'", val);
    return undefined;
  }

  if (!("allOptions" in val) || typeof val.allOptions !== "string") {
    console.error("not an object: missing or invalid 'allOptions'", val);
    return undefined;
  }

  const pickedItemsObject = JSON.parse(val.pickedItems);
  const pickedItems: countItems = new Map(Object.entries(pickedItemsObject));

  const allOptionsObject = JSON.parse(val.allOptions);
  const allOptions: countItems = new Map(Object.entries(allOptionsObject));

  console.log("at draft.ts");
  console.log(typeof allOptions);
  return {
    draftId: val.draftId,
    curDrafterName: val.curDrafterName,
    pickedItems: pickedItems,
    rounds: val.rounds,
    allOptions: allOptions,
  };
}
