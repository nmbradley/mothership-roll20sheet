/** Presentation helpers turning stored game terms into display text. */

/** Capitalises each word: "hand-to-hand combat" becomes "Hand-to-hand Combat". */
export function titleCase(value: string): string {
  const words = value.split(" ");
  const capitalised = words.map((word) => {
    const first = word.charAt(0);
    const rest = word.slice(1);
    return `${first.toUpperCase()}${rest}`;
  });
  const joined = capitalised.join(" ");
  return joined;
}
