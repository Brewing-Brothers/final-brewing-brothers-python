export type ThemeName = "rustic" | "bold" | "minimal";
export function getTheme(name: string | undefined): ThemeName {
  if (name === "rustic" || name === "bold" || name === "minimal") return name;
  return "rustic";
}
export function themeClasses(theme: ThemeName) {
  switch (theme) {
    case "rustic":  return { pageBg:"bg-amber-50", card:"bg-white border border-amber-200 shadow-sm", accent:"text-amber-900", button:"bg-amber-700 hover:bg-amber-800 text-white transition", badge:"bg-amber-100 text-amber-800" };
    case "bold":    return { pageBg:"bg-zinc-950",  card:"bg-zinc-900 border border-zinc-800",          accent:"text-lime-300",  button:"bg-lime-400 hover:bg-lime-300 text-zinc-950 transition",   badge:"bg-zinc-800 text-zinc-100" };
    case "minimal":
    default:        return { pageBg:"bg-slate-50",  card:"bg-white border border-slate-200",            accent:"text-slate-900", button:"bg-slate-900 hover:bg-slate-800 text-white transition",     badge:"bg-slate-100 text-slate-700" };
  }
}
