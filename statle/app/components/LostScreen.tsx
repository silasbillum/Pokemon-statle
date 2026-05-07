"use client";
type LostScreenProps = {
    onPlayAgain: () => void;
    score: number;
};

export default function LostScreen({ onPlayAgain, score }: LostScreenProps) {
    return (
        <div className="flex flex-col items-center justify-center  bg-gray-100 dark:bg-gray-800">
            <h1 className="text-4xl font-bold text-red-500">You Lost!</h1>
            <p>you got {score} points</p>
            <p className="text-lg text-gray-600">Better luck next time!</p>
            <button
                onClick={onPlayAgain}
                className="mt-4 px-6 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600"
            >
                Play Again
            </button>
        </div>
    );
};
