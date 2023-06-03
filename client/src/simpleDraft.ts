// import { Draft } from "../../server/src/draft";

// export class simpleDraft implements Draft {
export class simpleDraft {
  readonly rounds: number;
  curDrafter: string;
  options: Set<string>;
  drafters: Map<string, Set<string>>; // key: drafterName, value: selectedOptions

  constructor(
    curDrafter: string,
    rounds: number,
    options: string,
    drafters: string
  ) {
    this.curDrafter = curDrafter;
    this.rounds = rounds;
    this.options = this.makeOptions(options);
    this.drafters = this.makeDrafters(drafters);
  }

  toList(itemsString: string): string[] {
    const itemsList: string[] = itemsString
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    return itemsList;
  }

  makeOptions(options: string): Set<string> {
    const optionsList = this.toList(options);

    const optionSet = new Set<string>();
    for (const option of optionsList) {
      optionSet.add(option);
    }
    return optionSet;
  }
  makeDrafters(draftersName: string): Map<string, Set<string>> {
    const draftersNameList = this.toList(draftersName);
    const DrafterResult = new Map<string, Set<string>>();
    for (const drafterName of draftersNameList) {
      const selectedOptions = new Set<string>();
      DrafterResult.set(drafterName, selectedOptions);
    }
    return DrafterResult;
  }
}
/**
 * Factory method that makes the makeSimpleDraft object
 * @param
 * @returns the makeSimpleDraft object
 */
export function makeSimpleDraft(
  curDrafter: string,
  rounds: number,
  options: string,
  drafters: string
): simpleDraft {
  return new simpleDraft(curDrafter, rounds, options, drafters);
}
