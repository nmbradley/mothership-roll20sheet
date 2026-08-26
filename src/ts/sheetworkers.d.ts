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

type GetAttrsResponse = { [x: string]: string | number };

type EventInfo = {
  sourceAttribute: string;
  newValue: string;
  previousValue: string;
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

// --- CORE SHEETWORKER FUNCTIONS ---
declare function on(events: string, callback: (eventInfo: EventInfo) => void): void;

declare function setAttrs(
  object: Record<string, string | number>,
  callback?: () => void,
): void;

// `silent` suppresses the change events the write would otherwise raise.
declare function setAttrs(
  object: Record<string, string | number>,
  options: { silent: boolean },
  callback?: () => void,
): void;

declare function getAttrs(
  request: string[],
  callback: (response: Record<string, string>) => void,
): void;

// --- REPEATING SECTION FUNCTIONS ---
declare function getSectionIDs(
  section: string,
  callback: (ids: string[]) => void,
): void;

declare function generateRowID(): string;

declare function removeRepeatingRow(RowID: string): void;

// --- CUSTOM ROLL FUNCTIONS ---
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

// --- TRANSLATION FUNCTIONS ---
declare function getTranslationByKey(key: string | string[]): string;

declare function getTranslationLanguage(): string;

// --- TOKEN SETTINGS FUNCTIONS ---
declare function setDefaultToken(settings: Record<string, unknown>): void;

// --- COMPENDIUM FUNCTIONS ---
declare function getCompendiumPage(
  page: string,
  callback: (pageData: CompendiumResponse) => void,
): void;

// Passing several page names returns them together.
declare function getCompendiumPage(
  pages: readonly string[],
  callback: (pageData: CompendiumResponse[]) => void,
): void;

declare function getCompendiumQuery(
  query: string,
  callback?: (queryData: CompendiumResponse[]) => void,
): void;

// --- CHARACTERMANCER FUNCTIONS ---
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

// The callback receives the id of the row just added.
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
