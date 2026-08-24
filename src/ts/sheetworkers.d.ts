/* eslint-disable @typescript-eslint/ban-types */
interface RollResults {
  [roll: string]: RollResult
}

interface RollResult {
  dice: number[],
  expression: string,
  result: number,
  rolls: Roll[],
}

interface Roll {
  dice: number,
  results: number[],
  sides: number
}
interface GetAttrsResponse {
  [x: string]: string | number;
}

interface EventInfo {
  sourceAttribute: string,
  newValue: string,
  previousValue: string,
}

declare function on(events: string, callback: Function): void;
declare function setAttrs(object: Object, callback?: Function): void;
declare function getAttrs(request: string[], callback: (response: Record<string, string>) => void): void;
declare function getSectionIDs(section: string, callback: Function): void;
declare function generateRowID(): string;
declare function removeRepeatingRow(RowID:string): void;
declare function getTranslationByKey(key: string | string[]): string;
declare function getTranslationLanguage(): string;
declare function setDefaultToken(settings:object): void;
declare function startRoll(roll:string): Promise< {rollId: string, results: RollResults }>;
declare function finishRoll(rollId: string, finish: object): void;declare function getCharmancerData(): any;
declare function setCharmancerText(obj: any): void;
declare function startCharactermancer(page: string): void;
declare function finishCharactermancer(): void;
declare function setCharmancerOptions(step: string, options: string | string[], data?: any): void;
declare function deleteCharmancerData(nodes: string[], callback?: Function): void;
declare function hideChoices(arr: any[]): void;
declare function showChoices(arr: any[]): void;
declare function parseJSON(str: string): any;
declare function getCompendiumPage(page: string, callback: Function): void;
declare function capitalizeString(str: string): string;
declare function getAttrs(request: string[], callback: (response: any) => void): void;
declare function addRepeatingSection(section: string, data: string, callback?: Function): void;
declare function getRepeatingSections(section: string, callback?: Function): void;
declare function clearRepeatingSections(section: string, callback?: Function): void;
declare function disableCharmancerOptions(step: string, options: string | string[], data?: any): void;
declare function getCompendiumQuery(query: string, callback?: Function): void;
