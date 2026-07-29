import axios from "axios";

const TOKEN_RE = /\{Y{2,4}\}/gi;

/**
 * Heq prapashtesat ligjore dhe shenjat e pikësimit që emri i furnitorit të
 * krahasohet edhe nëse është shkruar pak ndryshe në furnitori.json.
 */
function normalizeName(name) {
  return String(name)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(sh\.?p\.?k|l\.?l\.?c|n\.?t\.?p|n\.?p\.?t|n\.?t\.?sh|sh\.?a|b\.?i|ltd|shpk|llc)\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Zëvendëson {YY} / {YYYY} me vitin e faturës.
 * @param {string} template psh. "F-{YY}-DSD-FE1-"
 * @param {string} isoDate  data e faturës në formatin YYYY-MM-DD
 */
export function resolvePrefix(template, isoDate) {
  if (!template) return "";
  const year = /^\d{4}-\d{2}-\d{2}$/.test(isoDate || "")
    ? isoDate.slice(0, 4)
    : String(new Date().getFullYear());
  return template.replace(TOKEN_RE, (token) =>
    token.length === 6 ? year : year.slice(2)
  );
}

/**
 * Ndërton një indeks nga prefikset.json: kërkim sipas `key` dhe sipas emrit
 * të normalizuar, që të mos prishet nëse emri redaktohet lehtë.
 */
export function buildPrefiksetIndex(list) {
  const byKey = new Map();
  const byName = new Map();
  (Array.isArray(list) ? list : []).forEach((item) => {
    const prefikset = (item.prefikset || []).filter((p) => p && p.prefiksi);
    if (!prefikset.length) return;
    if (item.key !== undefined && item.key !== null) byKey.set(item.key, prefikset);
    if (item.Name) byName.set(normalizeName(item.Name), prefikset);
  });
  return { byKey, byName };
}

export async function fetchPrefikset() {
  const response = await axios.get("/prefikset.json");
  return buildPrefiksetIndex(response.data);
}

/** Prefikset e njohura për një furnitor, ose një listë bosh. */
export function prefiksetPer(index, key, name) {
  if (!index) return [];
  return (
    (key !== undefined && key !== null && index.byKey.get(key)) ||
    (name && index.byName.get(normalizeName(name))) ||
    []
  );
}
