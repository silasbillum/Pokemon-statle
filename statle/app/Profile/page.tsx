"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
                const response = await fetch('/api/user/profile', {
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
        return <div className="text-red-500 text-center mt-10">{error}</div>;
    }

    if (!profile) {
        return <div className="text-center mt-10">Loading profile...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Your Profile</h1>
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Player Stats</div>
                    <div className="mt-4">
                        <p className="text-lg text-gray-800"><span className="font-bold">Highest Score:</span> {profile.highestScore}</p>
                        <p className="text-lg text-gray-800"><span className="font-bold">Total Games Played:</span> {profile.totalGamesPlayed}</p>
                        <p className="text-lg text-gray-800"><span className="font-bold">Average Score:</span> {profile.averageScore.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
