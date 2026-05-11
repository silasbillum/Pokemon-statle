
'use client';
import Link from "next/dist/client/link";
import Congratulations from "../components/Congratulations";
import { useEffect, useState } from 'react';
// Key for localStorage
const LOCAL_STORAGE_KEY = 'statle-anon-game';
import API_BASE_URL from '../lib/api';
import LostScreen from "../components/LostScreen";
const PLAYER_ID_KEY = 'statle-player-id';

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

  function getPlayerId() {
    if (typeof window === 'undefined') return 'server';

    const existing = localStorage.getItem(PLAYER_ID_KEY);
    if (existing) return existing;

    const created = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    localStorage.setItem(PLAYER_ID_KEY, created);
    return created;
  }

  function buildGameHeaders(token?: string | null) {
    return {
      'X-Player-Id': getPlayerId(),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }


  // Restore game state from localStorage if present
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setPokemon(state.pokemon || "");
        setScore(state.score || 0);
        setUsedStats(state.usedStats || []);
        setMessage(state.message || "");
        setGained(state.gained || 0);
        setRevealedStats(state.revealedStats || {});
        setRevealedPokemon(state.revealedPokemon || null);
        setGameOver(state.gameOver || false);
        setWon(state.won || false);
        setbackground(state.background || "bg-gray-100 dark:bg-gray-800");
        setArtworkName(state.artworkName || "");
        return;
      } catch {}
    }
    startGame();
  }, []);

  useEffect(() => {
    setArtworkName(pokemon);
  }, [pokemon]);

  async function startGame() {
    const response = await fetch(`${API}/start`, {
      method: "POST",
      headers: buildGameHeaders()
    });
    if (!response.ok) {
      setMessage("Could not start game. Is the API running?");
      return;
    }
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
    setArtworkName("");
    // Remove saved state on new game
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }
  


  async function handleGuess(stat: string) {
    const res = await fetch(`${API}/guess/${stat}`, {
      method: "POST",
      headers: buildGameHeaders()
    });

    if (!res.ok) {
      setMessage("Could not submit guess. Please try again.");
      return;
    }

    const data = await res.json();
    const revealedPokemonData = data.revealedPokemon as RevealedPokemon | undefined;

    let newRevealedPokemon = revealedPokemon;
    if (revealedPokemonData) {
      setRevealedPokemon(revealedPokemonData);
      newRevealedPokemon = revealedPokemonData;
    }

    let isGameOver = false;
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
      isGameOver = true;
      if (data.score >= 600) {
        await WonGame();
      }
      await SaveGame();
    } else {
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

    // Save state to localStorage for anonymous users
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        const state = {
          pokemon: isGameOver ? "" : data.pokemonName,
          score: data.score,
          usedStats: data.usedStats,
          message: data.message,
          gained: data.gained,
          revealedStats: isGameOver ? {} : { ...revealedStats, [stat]: data.gained },
          revealedPokemon: isGameOver ? null : newRevealedPokemon,
          gameOver: isGameOver,
          won: isGameOver && data.score >= 600,
          background: data.gained >= 100 ? "bg-green-100 dark:bg-green-200" : "bg-red-100 dark:bg-red-900",
          artworkName: artworkName,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      }
    }
  }

  async function SaveGame() {
    const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
    await fetch(`${API}/save`, {
      method: "POST",
      headers: buildGameHeaders(token)
    });
  }

  function getColor(value?: number) {
    if (value === undefined) return 'text-gray-900 dark:text-white';
    return value < 100 ? 'text-red-500' : 'text-green-500';
  }

  async function WonGame() {
    setWon(true);
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
      {gameOver && !won && <LostScreen onPlayAgain={startGame} score={score} />}

              
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-8 dark:bg-gray-900">
        <div className="w-full max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-slate-900 dark:text-slate-100 mb-12">Statle - Guess the Pokémon's Stats!</h1>
          <h2 className="text-2xl font-semibold text-center text-slate-700 dark:text-slate-300 mb-6">Get over 600 points to win!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-slate-300 bg-slate-50/95 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-800/90">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
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
                <p className="text-xl font-bold text-slate-900 dark:text-white">Score: {score}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
              </div>
              
              
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_240px] gap-8 items-start">
              <div className="flex flex-col gap-4">

              <>
                <button onClick={() => handleGuess("hp")} disabled={usedStats.includes("hp")} className={`flex justify-between items-center w-full p-4 rounded-lg bg-slate-100 text-slate-900 border border-slate-300 shadow-sm hover:bg-slate-200 hover:border-slate-400 hover:shadow-md transition-all duration-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700`}>
                  <span className="text-lg font-semibold text-slate-800 dark:text-slate-200 ">HP </span>
                  <span className={`text-xl font-mono font-bold ${getColor(revealedStats["hp"])}`}>{revealedStats["hp"] ?? "?"}</span>
                </button>
                <button onClick={() => handleGuess("attack")} disabled={usedStats.includes("attack")} className={`flex justify-between items-center w-full p-4 rounded-lg bg-slate-100 text-slate-900 border border-slate-300 shadow-sm hover:bg-slate-200 hover:border-slate-400 hover:shadow-md transition-all duration-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700`}>
                  <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">Attack</span>
                  <span className={`text-xl font-mono font-bold ${getColor(revealedStats["attack"])}`}>{revealedStats["attack"] ?? "?"}</span>
                </button>
                <button onClick={() => handleGuess("defense")} disabled={usedStats.includes("defense")} className={`flex justify-between items-center w-full p-4 rounded-lg bg-slate-100 text-slate-900 border border-slate-300 shadow-sm hover:bg-slate-200 hover:border-slate-400 hover:shadow-md transition-all duration-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700`}>
                  <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">Defense</span>
                  <span className={`text-xl font-mono font-bold ${getColor(revealedStats["defense"])}`}>{revealedStats["defense"] ?? "?"}</span>
                </button>
                <button onClick={() => handleGuess("sp_atk")} disabled={usedStats.includes("sp_atk")} className={`flex justify-between items-center w-full p-4 rounded-lg bg-slate-100 text-slate-900 border border-slate-300 shadow-sm hover:bg-slate-200 hover:border-slate-400 hover:shadow-md transition-all duration-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700`}>
                  <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">Sp. Atk</span>
                  <span className={`text-xl font-mono font-bold ${getColor(revealedStats["sp_atk"])}`}>{revealedStats["sp_atk"] ?? "?"}</span>
                </button>
                <button onClick={() => handleGuess("sp_def")} disabled={usedStats.includes("sp_def")} className={`flex justify-between items-center w-full p-4 rounded-lg bg-slate-100 text-slate-900 border border-slate-300 shadow-sm hover:bg-slate-200 hover:border-slate-400 hover:shadow-md transition-all duration-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700`}>
                  <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">Sp. Def</span>
                  <span className={`text-xl font-mono font-bold ${getColor(revealedStats["sp_def"])}`}>{revealedStats["sp_def"] ?? "?"}</span>
                </button>
                <button onClick={() => handleGuess("speed")} disabled={usedStats.includes("speed")} className={`flex justify-between items-center w-full p-4 rounded-lg bg-slate-100 text-slate-900 border border-slate-300 shadow-sm hover:bg-slate-200 hover:border-slate-400 hover:shadow-md transition-all duration-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700`}>
                  <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">Speed</span>
                  <span className={`text-xl font-mono font-bold ${getColor(revealedStats["speed"])}`}>{revealedStats["speed"] ?? "?"}</span>
                </button>
              </>

              </div>

              <aside className="rounded-2xl border border-slate-300 bg-slate-50/95 p-6 shadow-md backdrop-blur dark:border-slate-700 dark:bg-slate-800/90">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Pokémon stats</h3>

                {revealedPokemon ? (
                  <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    <p className="mb-2 font-semibold text-slate-900 dark:text-white">
                      {revealedPokemon.name}
                    </p>
                    <div className="flex items-center justify-between rounded-lg bg-slate-100 px-4 py-3 dark:bg-slate-900/60">
                      <span className="font-medium text-slate-600 dark:text-slate-300">HP</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{revealedPokemon.stats.hp}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-100 px-4 py-3 dark:bg-slate-900/60">
                      <span className="font-medium text-slate-600 dark:text-slate-300">Attack</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{revealedPokemon.stats.attack}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-100 px-4 py-3 dark:bg-slate-900/60">
                      <span className="font-medium text-slate-600 dark:text-slate-300">Defense</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{revealedPokemon.stats.defense}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-100 px-4 py-3 dark:bg-slate-900/60">
                      <span className="font-medium text-slate-600 dark:text-slate-300">Sp. Atk</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{revealedPokemon.stats.special_attack}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-100 px-4 py-3 dark:bg-slate-900/60">
                      <span className="font-medium text-slate-600 dark:text-slate-300">Sp. Def</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{revealedPokemon.stats.special_defense}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-100 px-4 py-3 dark:bg-slate-900/60">
                      <span className="font-medium text-slate-600 dark:text-slate-300">Speed</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{revealedPokemon.stats.speed}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Pick a stat to show the full stat list here.
                  </p>
                )}
              </aside>

            </div>
          </div>
          <div className="text-center mt-8">
            < button onClick={startGame} className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200">
              Try Again
            </button>
          </div>
          <div className="text-center mt-8">
            <Link href="/" className="text-sm text-slate-500 dark:text-slate-400 hover:underline">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
