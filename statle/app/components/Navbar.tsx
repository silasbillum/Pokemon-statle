"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  const loadUser = () => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsername(parsedUser.username);
      } catch {
        setUsername(null);
      }
    } else {
      setUsername(null);
    }
  };

  useEffect(() => {
    loadUser();

    // 🔥 listen for changes (important)
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwtToken");
    setUsername(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <span
            className="text-3xl font-bold text-sky-700 cursor-pointer hover:opacity-80 transition-opacity dark:text-sky-400"
            onClick={() => router.push("/")}
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            Statle
          </span>
          <div className="hidden md:flex gap-6">
            <span
              onClick={() => router.push("/gameplay")}
              className="text-slate-700 font-semibold cursor-pointer hover:text-sky-600 transition-colors dark:text-slate-300 dark:hover:text-sky-400"
            >
              Gameplay
            </span>
            <span
              onClick={() => router.push("/Leaderboard")}
              className="text-slate-700 font-semibold cursor-pointer hover:text-sky-600 transition-colors dark:text-slate-300 dark:hover:text-sky-400"
            >
              Leaderboard
            </span>
            {username && (
              <span
                onClick={() => router.push("/Profile")}
                className="text-slate-700 font-semibold cursor-pointer hover:text-sky-600 transition-colors dark:text-slate-300 dark:hover:text-sky-400"
              >
                Profile
              </span>
            )}
            {username && (
              <span
                onClick={() => router.push("/Pokedex")}
                className="text-slate-700 font-semibold cursor-pointer hover:text-sky-600 transition-colors dark:text-slate-300 dark:hover:text-sky-400"
              >
                Pokedex
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4 items-center">
          {username ? (
            <>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Hello, {username}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-rose-500 bg-rose-500 px-4 py-2 font-bold text-white transition-all hover:bg-rose-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/Register")}
                className="rounded-lg border border-amber-300 bg-amber-200 px-4 py-2 font-bold text-slate-900 transition-all hover:bg-amber-300 dark:border-amber-400 dark:bg-amber-300 dark:hover:bg-amber-400"
              >
                Register
              </button>
              <button
                onClick={() => router.push("/Login")}
                className="rounded-lg border border-sky-600 bg-sky-600 px-4 py-2 font-bold text-white transition-all hover:bg-sky-700"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}