import fs from "node:fs";
import path from "node:path";

/**
 * Minimal audit:
 * - exact duplicates by (prediction + signs + positiveActions) per orientation
 * - near duplicates by first N chars of prediction and by signs joined
 *
 * Outputs a JSON report to stdout.
 */

const ROOT = process.cwd();
const cardsPath = path.join(ROOT, "src", "data", "cards.json");
const raw = fs.readFileSync(cardsPath, "utf8");
const data = JSON.parse(raw);

const cards = Array.isArray(data?.cards) ? data.cards : [];

function norm(s) {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function keyExact(card, orientation) {
  const i = card?.[orientation];
  const prediction = norm(i?.prediction);
  const signs = (i?.signs ?? []).map(norm).join(" | ");
  const actions = (i?.positiveActions ?? []).map(norm).join(" | ");
  return `${prediction} || ${signs} || ${actions}`;
}

function keyNearPrediction(card, orientation, n = 30) {
  const i = card?.[orientation];
  return norm(i?.prediction).slice(0, n);
}

function keyNearSigns(card, orientation) {
  const i = card?.[orientation];
  return (i?.signs ?? []).map(norm).join(" | ");
}

function countDupes(map) {
  const entries = Array.from(map.entries())
    .map(([k, arr]) => ({ key: k, count: arr.length, cards: arr }))
    .filter((x) => x.count > 1)
    .sort((a, b) => b.count - a.count);
  return entries;
}

const orientations = ["upright", "reversed"];

const report = {
  source: "src/data/cards.json",
  totalCards: cards.length,
  orientations: {},
};

for (const orientation of orientations) {
  const exactMap = new Map();
  const nearPredMap = new Map();
  const nearSignsMap = new Map();

  for (const card of cards) {
    const cardId = card?.id;
    const cardName = card?.name;
    const ref = { id: cardId, name: cardName };

    const exact = keyExact(card, orientation);
    const nearPred = keyNearPrediction(card, orientation, 30);
    const nearSigns = keyNearSigns(card, orientation);

    if (!exactMap.has(exact)) exactMap.set(exact, []);
    exactMap.get(exact).push(ref);

    if (!nearPredMap.has(nearPred)) nearPredMap.set(nearPred, []);
    nearPredMap.get(nearPred).push(ref);

    if (!nearSignsMap.has(nearSigns)) nearSignsMap.set(nearSigns, []);
    nearSignsMap.get(nearSigns).push(ref);
  }

  report.orientations[orientation] = {
    uniqueExact: exactMap.size,
    exactDuplicates: countDupes(exactMap).slice(0, 20),
    nearDuplicatePredictionFirst30: countDupes(nearPredMap).slice(0, 20),
    nearDuplicateSigns: countDupes(nearSignsMap).slice(0, 20),
  };
}

process.stdout.write(JSON.stringify(report, null, 2));

