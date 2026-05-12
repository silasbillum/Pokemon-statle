"use client";
type LeaderboardPlayer = {
    username: string;
    score: number;
    pokemonNames: string[];
    date: string;
};

type ShowPokemonTeamProps = {
    player: LeaderboardPlayer | null;
};

const getPokemonImage = (name: string) => {
    const normalizedName = name.toLowerCase().replace(/\s+/g, '-');
    return `https://img.pokemondb.net/artwork/${normalizedName}.jpg`;
};

export default function ShowPokemonTeam({ player }: ShowPokemonTeamProps) {
    return (
        <aside className="rounded-xl bg-white dark:bg-gray-800 shadow-lg p-4 lg:sticky lg:top-8 self-start">
            <h2 className="text-xl font-bold mb-4">Team Preview</h2>

            {player ? (
                <div>
                    <div className="mb-4 rounded-lg bg-gray-100 dark:bg-gray-700 p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Selected player</p>
                        <p className="text-lg font-semibold">{player.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Score: {player.score}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {player.pokemonNames.map((pokemon) => (
                            <div
                                key={pokemon}
                                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 p-3 flex flex-col items-center"
                            >
                                <img
                                    src={getPokemonImage(pokemon)}
                                    alt={pokemon}
                                    className="w-24 h-24 object-contain drop-shadow-md"
                                    loading="lazy"
                                    onError={(event) => {
                                        const image = event.currentTarget;
                                        image.src = `https://img.pokemondb.net/artwork/${pokemon.split('-')[0].toLowerCase()}.jpg`;
                                    }}
                                />
                                <span className="mt-2 text-sm font-medium capitalize text-center">{pokemon}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Hover over a player to see their team.</p>
            )}
        </aside>
    );
}
