import { PremierTeamSearch } from '@/components/player/premier-team-search';
import { Trophy, Shield, Swords } from 'lucide-react';

export default function PremierPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            VALORANT Premier
          </h1>
          <p className="text-gray-400 text-lg">
            Search for Premier teams, view leaderboards, and track competitive standings
          </p>
        </div>

        {/* Premier Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <Shield className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Team Lookup</h3>
            <p className="text-gray-400 text-sm">
              Search for any Premier team by name and tag to view their stats, members, and rankings.
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <Trophy className="w-8 h-8 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Leaderboards</h3>
            <p className="text-gray-400 text-sm">
              Browse top teams in your region, conference, and division to see who's climbing.
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <Swords className="w-8 h-8 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Match History</h3>
            <p className="text-gray-400 text-sm">
              Track Premier league matches, points gained/lost, and performance over time.
            </p>
          </div>
        </div>

        {/* Premier Team Search Component */}
        <PremierTeamSearch />
      </div>
    </div>
  );
}
