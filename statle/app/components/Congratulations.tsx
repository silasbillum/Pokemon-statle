"use client";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";

export default function Congratulations() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
            <Confetti />
            <h1 className="text-4xl font-bold text-green-600 mb-4">Congratulations!</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">You got over 600 points!</p>

            <button
                onClick={() => router.push("/gameplay")}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
            >
                Play Again
            </button>
        </div>
    );
}