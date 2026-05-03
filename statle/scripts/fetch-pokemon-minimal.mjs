import fs from "node:fs/promises";
import path from "node:path";

const API_BASE = "https://pokeapi.co/api/v2";
const OUTPUT_PATH = path.resolve("./public/pokemon-details.json");
const CONCURRENCY = 15;

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`);
  }
  return response.json();
}

function mapStats(statsArray) {
  const get = (name) => statsArray.find((s) => s.stat.name === name)?.base_stat ?? 0;
  return {
    hp: get("hp"),
    attack: get("attack"),
    defense: get("defense"),
    special_attack: get("special-attack"),
    special_defense: get("special-defense"),
    speed: get("speed"),
  };
}

async function runWithConcurrency(items, worker, limit) {
  const results = [];
  let currentIndex = 0;

  async function runner() {
    while (currentIndex < items.length) {
      const index = currentIndex;
      currentIndex += 1;
      results[index] = await worker(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: limit }, () => runner()));
  return results;
}

async function main() {
  console.log("Fetching Pokemon list...");
  const list = await fetchJson(`${API_BASE}/pokemon?limit=20000&offset=0`);

  console.log(`Found ${list.results.length} Pokemon. Fetching details...`);

  const pokemon = await runWithConcurrency(
    list.results,
    async (entry, index) => {
      const details = await fetchJson(entry.url);
      if ((index + 1) % 100 === 0) {
        console.log(`Fetched ${index + 1}/${list.results.length}`);
      }
      return {
        id: details.id,
        name: details.name,
        stats: mapStats(details.stats),
      };
    },
    CONCURRENCY
  );

  pokemon.sort((a, b) => a.id - b.id);

  const payload = {
    pokemon,
  };

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`Saved ${pokemon.length} Pokemon to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
