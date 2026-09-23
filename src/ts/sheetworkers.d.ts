type RollResults = { [roll: string]: RollResult };

type RollResult = {
  dice: number[];
  expression: string;
  result: number;
  rolls: Roll[];
};

type Roll = {
  dice: number;
  results: number[];
  sides: number;
};

/** Row ids for one repeating section, in sheet order. */
type RepeatingSectionDetails = {
  list: string[];
};

type EventInfo = {
  sourceAttribute: string;
  /** The new value, present on `change:` and `mancerchange:` events only. */
  newValue?: string;
  /** Present on `change:` events only; see {@link EventInfo.newValue}. */
  previousValue?: string;
  sourceType: string;
  triggerName: string;
  /** Present on repeating-section events: the row that raised it. */
  sourceSection?: string;
  /** Present on `mancerroll:` events. */
  roll?: RollResult[];
  /** Present on `mancerfinish:` events: the completed charactermancer data. */
  data?: Record<string, unknown>;
};

type CompendiumResponse = {
  Category: string;
  /** Roll20 returns the page name lowercase on query results. */
  name: string;
  Name: string;
  data: Record<string, string | undefined>;
};

declare function on(events: string, callback: (eventInfo: EventInfo) => void): void;

declare function setAttrs(
  object: Record<string, string | number>,
  callback?: () => void,
): void;

declare function setAttrs(
  object: Record<string, string | number>,
  options: { silent: boolean },
  callback?: () => void,
): void;

declare function getAttrs(
  request: string[],
  callback: (response: Record<string, string>) => void,
): void;

declare function getSectionIDs(
  section: string,
  callback: (ids: string[]) => void,
): void;

declare function generateRowID(): string;

declare function removeRepeatingRow(RowID: string): void;

declare function startRoll(
  roll: string,
): Promise<{
  rollId: string;
  results: RollResults;
}>;

declare function finishRoll(
  rollId: string,
  finish: Record<string, unknown>,
): void;

/** Roll20's translation lookup, which answers `false` when the key is missing. */
declare function getTranslationByKey(key: string | string[]): string | false;

declare function getTranslationLanguage(): string;

declare function setDefaultToken(settings: Record<string, unknown>): void;

declare function getCompendiumPage(
  page: string,
  callback: (pageData: CompendiumResponse) => void,
): void;

declare function getCompendiumPage(
  pages: readonly string[],
  callback: (pageData: CompendiumResponse[]) => void,
): void;

declare function getCompendiumQuery(
  query: string,
  callback?: (queryData: CompendiumResponse[]) => void,
): void;

declare function startCharactermancer(page: string): void;

declare function finishCharactermancer(): void;

declare function getCharmancerData(): Record<string, unknown>;

declare function setCharmancerText(obj: Record<string, string>): void;

declare function setCharmancerOptions(
  step: string,
  options: string | string[],
  data?: Record<string, unknown>,
): void;

declare function disableCharmancerOptions(
  step: string,
  options: string | string[],
  data?: Record<string, unknown>,
): void;

declare function deleteCharmancerData(
  nodes?: string[],
  callback?: () => void,
): void;

declare function hideChoices(arr: string[]): void;

declare function showChoices(arr: string[]): void;

declare function addRepeatingSection(
  section: string,
  data: string,
  callback?: (rowId: string) => void,
): void;

declare function getRepeatingSections(
  section: string,
  callback?: (details: RepeatingSectionDetails) => void,
): void;

declare function clearRepeatingSections(
  section: string,
  callback?: () => void,
): void;
