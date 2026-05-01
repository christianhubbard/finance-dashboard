/** Maps Figma theme token names to CSS color variables */
export const themeToCssVar: Record<string, string> = {
  green: "var(--color-secondary-green)",
  yellow: "var(--color-secondary-yellow)",
  cyan: "var(--color-secondary-cyan)",
  navy: "var(--color-secondary-navy)",
  red: "var(--color-secondary-red)",
  purple: "var(--color-secondary-purple)",
  turquoise: "var(--color-extended-turquoise)",
  brown: "var(--color-extended-brown)",
  magenta: "var(--color-extended-magenta)",
  blue: "var(--color-extended-blue)",
  stone: "var(--color-extended-stone)",
  army: "var(--color-extended-army)",
  gold: "var(--color-extended-gold)",
  orange: "var(--color-extended-orange)",
};

export function getThemeColor(theme: string): string {
  return themeToCssVar[theme] ?? themeToCssVar.green;
}
