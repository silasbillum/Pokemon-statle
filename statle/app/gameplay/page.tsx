
'use client';
import Link from "next/dist/client/link";
import Navbar from "../components/Navbar";
import Congratulations from "../components/Congratulations";
import { useEffect, useState } from 'react';
import { refresh } from "next/cache";
import Confetti from "react-confetti";
import API_BASE_URL from '../lib/api';

type RevealedPokemon = {
  name: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
  };
};

export default function GameplayPage() {



  // ... existing code ...

  const API = `${API_BASE_URL}/game`;

  const [pokemon, setPokemon] = useState("");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [usedStats, setUsedStats] = useState<string[]>([]);
  const [gained, setGained] = useState(0);
  const [revealedStats, setRevealedStats] = useState<Record<string, number>>({});
  const [revealedPokemon, setRevealedPokemon] = useState<RevealedPokemon | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [background, setbackground] = useState("bg-gray-100 dark:bg-gray-800");
  const [won, setWon] = useState(false);
  const [artworkName, setArtworkName] = useState("");

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (won) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [won]);

  useEffect(() => {
    setArtworkName(pokemon);
  }, [pokemon]);

  async function startGame() {
    const response = await fetch(`${API}/start`, {
      method: "POST",
    });
    const data = await response.json();
    setPokemon(data.pokemonName);
    setScore(0);
    setUsedStats([]);
    setMessage(data.message);
    setGained(0);
    setRevealedStats({});
    setRevealedPokemon(null);
    setGameOver(false);
    setWon(false);
    setbackground("bg-gray-100 dark:bg-gray-800");

  }


  async function handleGuess(stat: string) {
    const res = await fetch(`${API}/guess/${stat}`, {
      method: "POST"
    });

    const data = await res.json();
    const revealedPokemonData = data.revealedPokemon as RevealedPokemon | undefined;

    if (revealedPokemonData) {
      setRevealedPokemon(revealedPokemonData);
    }

    if (data.usedStats.length >= 6) {
      setScore(data.score);
      setMessage(data.message);
      setUsedStats(data.usedStats);
      setGained(data.gained);
      setRevealedStats(prev => ({
        ...prev,
        [stat]: data.gained
      }));
      setGameOver(true);
      if (data.score >= 600) {
        scrollTo({ top: 0, behavior: "smooth" });
        await WonGame();

      }
      await SaveGame();
      return;
    }

    setPokemon(data.pokemonName);
    setScore(data.score);
    setMessage(data.message);
    setUsedStats(data.usedStats);
    setGained(data.gained);
    setRevealedStats(prev => ({
      ...prev,
      [stat]: data.gained
    }));

    if (data.gained >= 100) {
      setbackground("bg-green-100 dark:bg-green-200");
    } else {
      setbackground("bg-red-100 dark:bg-red-900");
    }




  }

  async function SaveGame() {
    const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
    await fetch(`${API}/save`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
  }

  function getColor(value?: number) {
    if (value === undefined) return 'text-gray-900 dark:text-white';
    return value < 100 ? 'text-red-500' : 'text-green-500';
  }

  async function WonGame() {
    setWon(true);
    scrollTo({ top: 0, behavior: "smooth" });
  }

  async function ShowAllStats() {
    const stats = ["hp", "attack", "defense", "sp_atk", "sp_def", "speed"];
    for (const stat of stats) {
      await handleGuess(stat);
    }
  }


  return (
    <>
      {won && <Congratulations onPlayAgain={startGame} />}

      <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
        <div className="w-full max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12">Statle - Guess the Pokémon's Stats!</h1>
          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">Get over 600 points to win!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {pokemon}
              </h2>
              <div className="relative w-48 h-48">
                <div className="absolute inset-0  rounded-full blur-2xl"></div>
                <img
                  src={`https://img.pokemondb.net/artwork/${artworkName || pokemon}.jpg`}
                  alt={pokemon}
                  className="relative w-full h-full object-contain drop-shadow-xl"
                  onError={() => {
                    const baseName = pokemon.split("-")[0];
                    if (baseName && artworkName !== baseName) {
                      setArtworkName(baseName);
                    }
                  }}
                />

              </div>
              <div className="mt-4">
                <p className="text-xl font-bold text-black dark:text-white">Score: {score}</p>
                <p className="text-sm text-gray-400">{message}</p>
              </div>


            </div>
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_240px] gap-8 items-start">
              <div className="flex flex-col gap-4">

                <>
                  <button onClick={() => handleGuess("hp")} disabled={usedStats.includes("hp")} className={`flex justify-between items-center w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200`}>
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200 ">HP </span>
                    <span className={`text-xl font-mono font-bold ${getColor(revealedStats["hp"])}`}>{revealedStats["hp"] ?? "?"}</span>
                  </button>
                  <button onClick={() => handleGuess("attack")} disabled={usedStats.includes("attack")} className={`flex justify-between items-center w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200 `}>
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Attack</span>
                    <span className={`text-xl font-mono font-bold ${getColor(revealedStats["attack"])}`}>{revealedStats["attack"] ?? "?"}</span>
                  </button>
                  <button onClick={() => handleGuess("defense")} disabled={usedStats.includes("defense")} className={`flex justify-between items-center w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200 `}>
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Defense</span>
                    <span className={`text-xl font-mono font-bold ${getColor(revealedStats["defense"])}`}>{revealedStats["defense"] ?? "?"}</span>
                  </button>
                  <button onClick={() => handleGuess("sp_atk")} disabled={usedStats.includes("sp_atk")} className={`flex justify-between items-center w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200 `}>
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Sp. Atk</span>
                    <span className={`text-xl font-mono font-bold ${getColor(revealedStats["sp_atk"])}`}>{revealedStats["sp_atk"] ?? "?"}</span>
                  </button>
                  <button onClick={() => handleGuess("sp_def")} disabled={usedStats.includes("sp_def")} className={`flex justify-between items-center w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200 `}>
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Sp. Def</span>
                    <span className={`text-xl font-mono font-bold ${getColor(revealedStats["sp_def"])}`}>{revealedStats["sp_def"] ?? "?"}</span>
                  </button>
                  <button onClick={() => handleGuess("speed")} disabled={usedStats.includes("speed")} className={`flex justify-between items-center w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200 `}>
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Speed</span>
                    <span className={`text-xl font-mono font-bold ${getColor(revealedStats["speed"])}`}>{revealedStats["speed"] ?? "?"}</span>
                  </button>
                </>

              </div>

              <aside className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Pokémon stats</h3>

                {revealedPokemon ? (
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                    <p className="mb-2 font-semibold text-gray-900 dark:text-white">
                      {revealedPokemon.name}
                    </p>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-900/60 px-4 py-3">
                      <span className="font-medium text-gray-600 dark:text-gray-300">HP</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">{revealedPokemon.stats.hp}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-900/60 px-4 py-3">
                      <span className="font-medium text-gray-600 dark:text-gray-300">Attack</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">{revealedPokemon.stats.attack}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-900/60 px-4 py-3">
                      <span className="font-medium text-gray-600 dark:text-gray-300">Defense</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">{revealedPokemon.stats.defense}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-900/60 px-4 py-3">
                      <span className="font-medium text-gray-600 dark:text-gray-300">Sp. Atk</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">{revealedPokemon.stats.special_attack}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-900/60 px-4 py-3">
                      <span className="font-medium text-gray-600 dark:text-gray-300">Sp. Def</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">{revealedPokemon.stats.special_defense}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-900/60 px-4 py-3">
                      <span className="font-medium text-gray-600 dark:text-gray-300">Speed</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">{revealedPokemon.stats.speed}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pick a stat to show the full stat list here.
                  </p>
                )}
              </aside>

            </div>
          </div>
          <div className="text-center mt-8">
            < button onClick={startGame} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200">
              Try Again
            </button>
          </div>
          <div className="text-center mt-8">
            <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
