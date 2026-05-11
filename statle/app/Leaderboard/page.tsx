"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API_BASE_URL from '../lib/api';

export default function LeaderboardPage() {

const LEADERBOARD_ENDPOINT = `${API_BASE_URL}/Leaderboard/top?limit=10`;
  const [leaderboard, setLeaderboard] = useState<{ username: string; score: number }[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(LEADERBOARD_ENDPOINT);
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankImage = (rank: number) => {
    if (rank === 1) {
      return "/Masterball.png";
    } else if (rank === 2) {
      return "/Ultraball.png";
    } else if (rank === 3) {
      return "/Greatball.png";
    } else {
      return "/pokeball.png";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Leaderboard</h1>
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="p-4">
            <div className="grid grid-cols-4 text-sm font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2">
              <div className="text-center">Rank</div>
              <div className="col-span-2">Player</div>
              <div className="text-right">Score</div>
            </div>
            {leaderboard.map((player, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;
              return (
                <div
                  key={index}
                  className={`grid grid-cols-4 items-center py-3 px-2 rounded-md transition-colors duration-200 ${isTopThree
                    ? "font-bold  hover:bg-yellow-100 dark:hover:bg-yellow-700/50"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    } ${rank === 1 ? "text-yellow-600 dark:text-yellow-800 bg-amber-200 dark:bg-amber-500 " : ""
                    } ${rank === 2 ? "text-gray-500 dark:text-gray-500 bg-gray-300 dark:bg-gray-300 " : ""
                    } ${rank === 3 ? "text-orange-600 dark:text-orange-800 bg-orange-300 dark:bg-orange-300 d" : ""
                    }`}
                >
                  <div className="flex items-center justify-center">
                    <span className="text-lg">{rank}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <img
                      src={getRankImage(rank)}
                      alt={`Rank ${rank}`}
                      className="w-8 h-8 mr-3"
                    />
                    <span>{player.username}</span>
                  </div>
                  <div className="text-right font-semibold">
                    {player.score}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="text-center mt-8">
          <a href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">
            &larr; Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}