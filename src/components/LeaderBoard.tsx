import React from 'react';
import { Trophy } from 'lucide-react';

const mockLeaderboard = [
  { rank: 1, name: "Alex Chen", score: 2840, solved: 145 },
  { rank: 2, name: "Sarah Smith", score: 2720, solved: 138 },
  { rank: 3, name: "Mike Johnson", score: 2650, solved: 132 },
  { rank: 4, name: "Emma Davis", score: 2590, solved: 129 },
  { rank: 5, name: "James Wilson", score: 2510, solved: 125 },
];

export const LeaderBoard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold">Leaderboard</h2>
      </div>
      <div className="space-y-4">
        {mockLeaderboard.map((user) => (
          <div
            key={user.rank}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className={`font-bold ${
                user.rank === 1 ? 'text-yellow-500' :
                user.rank === 2 ? 'text-gray-400' :
                user.rank === 3 ? 'text-amber-700' : 'text-gray-700'
              }`}>#{user.rank}</span>
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.solved} solved</span>
              <span className="font-semibold text-indigo-600">{user.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};