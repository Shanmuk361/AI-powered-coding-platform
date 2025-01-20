import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

export const LeaderBoard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<{ rank: number; name: string; score: number }[]>([]); // To hold the leaderboard data
  const [loading, setLoading] = useState<boolean>(true); // To manage loading state
  const [error, setError] = useState<string | null>(null); // To manage errors

  // Fetch leaderboard data from the backend
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/top-users');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const data = await response.json();

        // Add rank to each user based on the order in the list
        const rankedData = data.map((user: any, index: number) => ({
          rank: index + 1, // Assign rank based on array index
          name: user.name,
          score: user.score,
        }));

        setLeaderboard(rankedData); // Set the leaderboard data
      } catch (err) {
        setError('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []); // Empty dependency array means this runs only once when the component mounts

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while data is fetching
  }

  if (error) {
    return <div>{error}</div>; // Display error message if there’s an issue fetching the data
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold">Leaderboard</h2>
      </div>
      <div className="space-y-4">
        {leaderboard.map((user) => (
          <div
            key={user.rank}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span
                className={`font-bold ${
                  user.rank === 1
                    ? 'text-yellow-500'
                    : user.rank === 2
                    ? 'text-gray-400'
                    : user.rank === 3
                    ? 'text-amber-700'
                    : 'text-gray-700'
                }`}
              >
                #{user.rank}
              </span>
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-indigo-600">Score: {user.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
