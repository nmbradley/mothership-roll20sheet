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
  /**
   * Present on `change:` and `mancerchange:` events only. A `clicked:` event
   * carries no value, so this is undefined there -- declaring it required
   * would let a click handler read it without a warning.
   */
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
/**
 * Roll20 returns `false` -- not a string, and not undefined -- when the key is
 * missing from the loaded translation, which happens whenever translation.json
 * on the campaign is older than the sheet asking for a key. Callers must
 * narrow before touching string methods.
 */
declare function getTranslationByKey(key: string | string[]): string | false;

declare function getTranslationLanguage(): string;

// --- TOKEN SETTINGS FUNCTIONS ---
declare function setDefaultToken(settings: Record<string, unknown>): void;

// --- COMPENDIUM FUNCTIONS ---
// Unused by this sheet, so the response shape is taken from Roll20's docs
// rather than verified against live behaviour -- narrow before trusting it.
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
