"use client";

import { useState, useEffect } from 'react';
import { Pokemon } from './page';
import clsx from 'clsx';

interface PokemonCardProps {
    pokemon: Pokemon;
    status: 'seen' | 'caught' | 'unseen';
}

const PokemonCard = ({ pokemon, status }: PokemonCardProps) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const name = pokemon.name.toLowerCase();
        setImageUrl(`https://img.pokemondb.net/artwork/${name}.jpg`);
    }, [pokemon.name]);

    const handleImageError = () => {

        const baseName = pokemon.name.split('-')[0].toLowerCase();
        const fallbackUrl = `https://img.pokemondb.net/artwork/${baseName}.jpg`;


        if (imageUrl !== fallbackUrl) {
            setImageUrl(fallbackUrl);
        } else {

        }
    };

    const imageStyle: React.CSSProperties = {};
    if (status === 'seen') {
        imageStyle.filter = 'grayscale(100%)';
    } else if (status === 'unseen') {
        imageStyle.filter = 'brightness(0) contrast(200%)';
    }

    return (
        <div className="flex flex-col items-center rounded-lg border border-slate-200 bg-white/90 p-4 text-slate-800 shadow-md transition-transform transform hover:scale-105 backdrop-blur dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200">
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={status !== 'unseen' ? pokemon.name : 'Unknown Pokémon'}
                    className='w-24 h-24 object-contain drop-shadow-xl'
                    style={imageStyle}
                    onError={handleImageError}
                    loading="lazy"
                />
            )}
            <p className="mt-2 font-semibold text-center capitalize">
                {status !== 'unseen' ? pokemon.name : '???'}
            </p>
        </div>
    );
};

export default PokemonCard;
