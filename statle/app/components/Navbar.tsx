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
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <span
            className="text-3xl font-bold text-blue-600 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push("/")}
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            Statle
          </span>
          <div className="hidden md:flex gap-6">
            <span
              onClick={() => router.push("/gameplay")}
              className="text-gray-700 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
            >
              Gameplay
            </span>
            <span
              onClick={() => router.push("/Leaderboard")}
              className="text-gray-700 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
            >
              Leaderboard
            </span>
            {username && (
              <span
                onClick={() => router.push("/Profile")}
                className="text-gray-700 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
              >
                Profile
              </span>
            )}
            {username && (
              <span
                onClick={() => router.push("/Pokedex")}
                className="text-gray-700 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
              >
                Pokedex
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4 items-center">
          {username ? (
            <>
              <span className="text-gray-800 font-semibold">
                Hello, {username}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-bold border-2 border-red-500 hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/Register")}
                className="px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 font-bold border-2 border-yellow-400 hover:bg-yellow-500 transition-all"
              >
                Register
              </button>
              <button
                onClick={() => router.push("/Login")}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white font-bold border-2 border-blue-500 hover:bg-blue-600 transition-all"
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