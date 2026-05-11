"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API_BASE_URL from '../lib/api';

interface UserProfile {
    highestScore: number;
    totalGamesPlayed: number;
    averageScore: number;
}

const ProfilePage = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                router.push('/Login');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/user/profile`, {
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        router.push('/Login');
                    }
                    throw new Error('Failed to fetch profile data');
                }

                const data: UserProfile = await response.json();
                setProfile(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            }
        };

        fetchProfile();
    }, [router]);

    if (error) {
        return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><div className="text-red-500 text-center">{error}</div></div>;
    }

    if (!profile) {
        return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><div className="text-center">Loading profile...</div></div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900"><div className="container mx-auto px-4 py-8 text-slate-800 dark:text-slate-100">
            <h1 className="text-3xl font-bold text-center mb-8 text-slate-900 dark:text-slate-50">Your Profile</h1>
            <div className="max-w-md mx-auto rounded-xl border border-slate-200 bg-white/90 shadow-md backdrop-blur md:max-w-2xl dark:border-slate-800 dark:bg-slate-800/90">
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-sky-600 font-semibold dark:text-sky-400">Player Stats</div>
                    <div className="mt-4">
                        <p className="text-lg text-slate-800 dark:text-slate-200"><span className="font-bold">Highest Score:</span> {profile.highestScore}</p>
                        <p className="text-lg text-slate-800 dark:text-slate-200"><span className="font-bold">Total Games Played:</span> {profile.totalGamesPlayed}</p>
                        <p className="text-lg text-slate-800 dark:text-slate-200"><span className="font-bold">Average Score:</span> {profile.averageScore.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default ProfilePage;
