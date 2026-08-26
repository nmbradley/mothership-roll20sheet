import {
  charmancerData,
  displayTotal,
  statTotals,
} from "./helpers";
import { TrackedStats } from "./types";

const TOPBAR_CONTAINER = "sheet-t__topbar";

/**
 * Text updates painting every tracked stat into one topbar row.
 *
 * Both entry points below need exactly this, which is why the old file carried
 * two near-identical copies of the resolution logic.
 */
function topbarText(rowId: string): Record<string, string> {
  const data = charmancerData();
  const totals = statTotals(data);

  const updates: Record<string, string> = {};
  for (const stat of TrackedStats) {
    updates[`${rowId} .sheet-t__${stat}`] = displayTotal(totals[stat]);
  }
  return updates;
}

/** Adds the topbar row for a slide and fills it in. */
export function addTopBar(): void {
  addRepeatingSection(TOPBAR_CONTAINER, "topbar", (rowId: string) => {
    const updates = topbarText(rowId);
    setCharmancerText(updates);
  });
}

/** Repaints the existing topbar after a stat changes on any slide. */
export function refreshTopBar(): void {
  getRepeatingSections(TOPBAR_CONTAINER, (details) => {
    const rows = details.list;
    const rowId = rows[0];
    if (rowId === undefined) return;
    const updates = topbarText(rowId);
    setCharmancerText(updates);
  });
}
