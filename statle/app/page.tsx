"use client";

import Navbar from "./components/Navbar";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 font-sans dark:bg-gray-900">

      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-6xl">
              Welcome to Pokemon Statle
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Choose your challenge and see how you rank!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div
              onClick={() => router.push('/gameplay')}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 dark:border-slate-800 dark:bg-slate-800"
              style={{
                backgroundImage: "url('/pokeball.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/55 transition-colors duration-300"></div>
              <div className="relative p-8 z-10 flex flex-col h-full">
                <h3 className="text-3xl font-bold text-white">Statle</h3>
                <p className="mt-2 text-white/80 flex-grow">
                  A Pokemon stats guessing game inspired by Wordle and Statle.
                </p>
                <span className="mt-4 text-white font-semibold self-start">
                  Play Now &rarr;
                </span>
              </div>
            </div>


            <div
              onClick={() => router.push('/Leaderboard')}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 dark:border-slate-800 dark:bg-slate-800"
              style={{
                backgroundImage: "url('/Masterball.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/55 transition-colors duration-300"></div>
              <div className="relative p-8 z-10 flex flex-col h-full">
                <h3 className="text-3xl font-bold text-white">Leaderboard</h3>
                <p className="mt-2 text-white/80 flex-grow">
                  See how you rank against other players!
                </p>
                <span className="mt-4 text-white font-semibold self-start">
                  View Rankings &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}