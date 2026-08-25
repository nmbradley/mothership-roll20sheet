type RollResults = {
  [roll: string]: RollResult;
};

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
type GetAttrsResponse = {
  [x: string]: string | number;
};

type EventInfo = {
  sourceAttribute: string;
  newValue: string;
  previousValue: string;
  sourceType: string;
  triggerName: string;
};

type CompendiumResponse = {
  Category: string;
  Name: string;
  data: Record<string, string>;
};

declare function on(events: string, callback: (eventInfo: EventInfo) => void): void;
declare function setAttrs(
  object: Record<string, string | number>,
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
declare function getTranslationByKey(key: string | string[]): string;
declare function getTranslationLanguage(): string;
declare function setDefaultToken(settings: Record<string, unknown>): void;
declare function startRoll(
  roll: string,
): Promise<{ rollId: string; results: RollResults }>;
declare function finishRoll(
  rollId: string,
  finish: Record<string, unknown>,
): void;
declare function getCharmancerData(): Record<string, unknown>;
declare function setCharmancerText(obj: Record<string, string>): void;
declare function startCharactermancer(page: string): void;
declare function finishCharactermancer(): void;
declare function setCharmancerOptions(
  step: string,
  options: string | string[],
  data?: Record<string, unknown>,
): void;
declare function deleteCharmancerData(
  nodes: string[],
  callback?: () => void,
): void;
declare function hideChoices(arr: string[]): void;
declare function showChoices(arr: string[]): void;
declare function parseJSON(str: string): unknown;
declare function getCompendiumPage(
  page: string,
  callback: (pageData: CompendiumResponse) => void,
): void;
declare function capitalizeString(str: string): string;
declare function addRepeatingSection(
  section: string,
  data: string,
  callback?: () => void,
): void;
declare function getRepeatingSections(
  section: string,
  callback?: (details: Record<string, unknown>) => void,
): void;
declare function clearRepeatingSections(
  section: string,
  callback?: () => void,
): void;
declare function disableCharmancerOptions(
  step: string,
  options: string | string[],
  data?: Record<string, unknown>,
): void;
declare function getCompendiumQuery(
  query: string,
  callback?: (queryData: CompendiumResponse[]) => void,
): void;
