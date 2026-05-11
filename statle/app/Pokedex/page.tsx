"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import allPokemon from '@/public/pokemon-details.json';
import PokemonCard from './PokemonCard';
import API_BASE_URL from '../lib/api';

const generationRanges = [
    { gen: 1, start: 1, end: 151 },
    { gen: 2, start: 152, end: 251 },
    { gen: 3, start: 252, end: 386 },
    { gen: 4, start: 387, end: 493 },
    { gen: 5, start: 494, end: 649 },
    { gen: 6, start: 650, end: 721 },
    { gen: 7, start: 722, end: 809 },
    { gen: 8, start: 810, end: 905 },
    { gen: 9, start: 906, end: 1025 },
];

const getGenerationFromId = (id: number) => {
    for (const range of generationRanges) {
        if (id >= range.start && id <= range.end) {
            return range.gen;
        }
    }
    return null; 
};

interface PokedexEntry {
    pokemonId: number;
    pokemonName: string;
    status: 'seen' | 'caught';
}

export interface Pokemon {
    id: number;
    name: string;
    stats: {
        hp: number;
        attack: number;
        defense: number;
        special_attack: number;
        special_defense: number;
        speed: number;
    };
    sprites: {
        front_default: string;
    };
}

const PokedexPage = () => {
    const [userPokedex, setUserPokedex] = useState<Map<number, PokedexEntry>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPokedex = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                router.push('/Login');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/pokedex`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) router.push('/Login');
                    throw new Error('Failed to fetch Pokedex data');
                }

                const data: PokedexEntry[] = await response.json();
                const pokedexMap = new Map(data.map(entry => [entry.pokemonId, entry]));
                setUserPokedex(pokedexMap);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchPokedex();
    }, [router]);

    const getPokemonStatus = (pokemonId: number) => {
        return userPokedex.get(pokemonId)?.status || 'unseen';
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><div className="text-center">Loading Pokedex...</div></div>;
    }

    if (error) {
        return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><div className="text-red-500 text-center">{error}</div></div>;
    }

    const filteredPokemon = selectedGeneration
        ? (allPokemon.pokemon as Pokemon[]).filter(p => getGenerationFromId(p.id) === selectedGeneration)
        : (allPokemon.pokemon as Pokemon[]);

    const totalCount = filteredPokemon.length;
    const seenCount = filteredPokemon.filter(p => userPokedex.has(p.id)).length;
    const caughtCount = filteredPokemon.filter(p => userPokedex.get(p.id)?.status === 'caught').length;

    return (
        <div className="w-full px-4 py-8 flex bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto flex w-full">
            <aside className="w-1/6 pr-8">
                <h2 className="text-2xl font-bold mb-4">Generations</h2>
                <ul>
                    <li>
                        <button onClick={() => setSelectedGeneration(null)} className={`w-full text-left p-2 rounded ${!selectedGeneration ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}>
                            All
                        </button>
                    </li>
                    {generationRanges.map(range => (
                        <li key={range.gen}>
                            <button onClick={() => setSelectedGeneration(range.gen)} className={`w-full text-left p-2 rounded ${selectedGeneration === range.gen ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}>
                                Generation {range.gen}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

           
            <main className="w-5/6">
                <h1 className="text-4xl font-bold text-center mb-4" style={{ fontFamily: "'Press Start 2P', cursive" }}>Pokedex</h1>
                <div className="text-center mb-8 text-lg">
                    <p>Seen: {seenCount} / {totalCount}</p>
                    <p>Caught: {caughtCount} / {totalCount}</p>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-4">
                    {filteredPokemon.map(pokemon => {
                        const status = getPokemonStatus(pokemon.id);
                        return (
                            <PokemonCard key={pokemon.id} pokemon={pokemon} status={status} />
                        );
                    })}
                </div>
            </main>
            </div>
        </div>
    );
};

export default PokedexPage;
