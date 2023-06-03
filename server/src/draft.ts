export interface Draft {
  countOptions(options: string[]): Map<string, number>;

  toList(itemsString: string): string[];
}

export class simpleDraft implements Draft {
  readonly rounds: number;
  curDrafter: string;
  options: Map<string, number>; // key: the option, value: counter
  // drafters: Set<Drafter>;
  drafters: Map<string, Map<string, number>>; // key: drafterName, value: selectedOptions

  // TODO: how to operate curDrafter?
  constructor(
    curDrafter: string,
    rounds: number,
    options: string,
    drafters: string
  ) {
    this.curDrafter = curDrafter;
    this.rounds = rounds;
    this.options = this.makeOptionsMap(options);
    this.drafters = this.makeDraftersMap(drafters);
  }

  countOptions(options: string[]): Map<string, number> {
    const optionsMap = new Map<string, number>();
    for (const option of options) {
      optionsMap.set(option, 1 + (optionsMap.get(option) || 0));
    }
    return optionsMap;
  }

  toList(itemsString: string): string[] {
    const itemsList: string[] = itemsString
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    return itemsList;
  }

  makeOptionsMap(options: string): Map<string, number> {
    const optionsList = this.toList(options);
    const optionsMap = this.countOptions(optionsList);
    return optionsMap;
  }

  /**
   *
   * @requires drafters can only be separate by "\n", and cannot have duplicate drafter
   * @param draftersName
   * @returns
   */
  makeDraftersMap(draftersName: string): Map<string, Map<string, number>> {
    const draftersNameList = this.toList(draftersName);

    // create the main draft for uses
    const DrafterResult = new Map<string, Map<string, number>>();

    // put drafters name into draft
    for (const drafterName of draftersNameList) {
      const selectedOptions = new Map<string, number>(); // initial select option is empty

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
